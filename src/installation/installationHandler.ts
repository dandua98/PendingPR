import { Context } from "probot";
import { CONFIG } from "../config";

export namespace InstallationHandler {
  export async function onInstallation(context: Context) {
    let login = context.payload.installation.account.login;
    await Promise.all(
      context.payload.repositories.map(async (repo: any) => {
        await createLabel(context, login, repo);
      })
    );
  }

  export async function onInstallationRepoAdded(context: Context) {
    let login = context.payload.installation.account.login;
    await Promise.all(
      context.payload.repositories_added.map(async (repo: any) => {
        await createLabel(context, login, repo);
      })
    );
  }

  /*
   * Creates a PendingPR label on the repo if it doesn't have one
   *
   * @param context - Probot webhook context
   *
   * @param repo: repository payload
   */
  async function createLabel(context: Context, login: string, repo: any) {
    let payload = {
      owner: login,
      repo: repo.name,
      name: CONFIG.PENDING_PR_LABEL.name,
      color: CONFIG.PENDING_PR_LABEL.color,
      description: CONFIG.PENDING_PR_LABEL.description,
    };

    var archived: boolean = await isArchived(context, login, repo.name);

    try {
      let resp = await context.github.issues.getLabel(payload);
      if (resp.status !== 200 && !archived) {
        await context.github.issues.createLabel(payload);
      }
    } catch (err) {
      // 404 throws an error
      if (!archived) {
        await context.github.issues.createLabel(payload);
      }
    }
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
    login: string,
    repo: string
  ): Promise<boolean> {
    let repos = await context.github.repos.get({
      owner: login,
      repo: repo,
    });
    return repos.data.archived;
  }
}
