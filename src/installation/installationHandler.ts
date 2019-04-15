import { Context } from "probot";
import { CONFIG } from "../config";
import * as http_status_codes from "http-status-codes";

export namespace InstallationHandler {
  export async function onInstallation(context: Context) {
    for (let repo of context.payload.repositories) {
      await createLabel(context, repo);
    }
  }

  export async function onInstallationRepoAdded(context: Context) {
    for (let repo of context.payload.repositories_added) {
      await createLabel(context, repo);
    }
  }

  /*
   * Creates a label on a repo if it doesn't have one
   *
   * @param context - Probot webhook context
   *
   * @param repo: repository payload
   */
  async function createLabel(context: Context, repo: any) {
    let payload = {
      owner: getOwner(repo.full_name),
      repo: repo.name,
      name: CONFIG.PENDING_PR_LABEL.name,
      color: CONFIG.PENDING_PR_LABEL.color,
      description: CONFIG.PENDING_PR_LABEL.description
    };

    var archived: boolean = await isArchived(
      context,
      getOwner(repo.full_name),
      repo.name
    );

    await context.github.issues
      .getLabel(payload)
      .then(async resp => {
        if (resp.status !== http_status_codes.OK && !archived) {
          await context.github.issues.createLabel(payload);
        }
      })
      .catch(async () => {
        // 404 throws an error
        if (!archived) {
          await context.github.issues.createLabel(payload);
        }
      });
  }

  /*
   * Returns a repo's owner from fullName
   *
   * @param fullName - repo full name, i.e username/repo
   *
   * @returns - owner i.e username
   */
  function getOwner(fullName: string): string {
    return fullName.split("/")[0];
  }

  /*
   * Checks if a repo is archived
   *
   * @param context - Probot webhook context
   *
   * @param fullName - repo full name, i.e username/repo
   *
   * @returns - returns true if the repo is archived, false if it isn't
   */
  async function isArchived(
    context: Context,
    owner: string,
    repo: string
  ): Promise<boolean> {
    return await context.github.repos
      .get({ owner: owner, repo: repo })
      .then(resp => {
        return resp.data.archived;
      });
  }
}
