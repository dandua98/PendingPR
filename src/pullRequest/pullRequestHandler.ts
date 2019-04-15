import { Context } from "probot";
import * as http_status_codes from "http-status-codes";
import { CONFIG } from "../config";

export namespace PullRequestHandler {
  // For more information, check:
  // https://help.github.com/en/articles/closing-issues-using-keywords
  const CLOSE_KEYWORDS: string[] = [
    "close",
    "closes",
    "closed",
    "fix",
    "fixes",
    "fixed",
    "resolve",
    "resolves",
    "resolved"
  ];

  export async function onOpenRequestHandler(context: Context) {
    const body: string = context.payload.pull_request.body.toLowerCase();

    const issues: number[] = parseIssues(body);

    for (let issue of issues) {
      isOpenIssue(context, issue).then(async resp => {
        if (resp) {
          let payload = context.repo({
            number: issue,
            labels: [CONFIG.PENDING_PR_LABEL.name]
          });

          await context.github.issues.addLabels(payload);
        }
      });
    }
  }

  export async function onEditRequestHandler(context: Context) {
    await onOpenRequestHandler(context);
  }

  export async function onCloseRequestHandler(context: Context) {
    const body: string = context.payload.pull_request.body.toLowerCase();

    const issues: number[] = parseIssues(body);

    for (let issue of issues) {
      hasLabelPendingPR(context, issue).then(async resp => {
        if (resp) {
          let payload = context.repo({
            number: issue,
            labels: [CONFIG.PENDING_PR_LABEL.name]
          });

          await context.github.issues.removeLabels(payload);
        }
      });
    }
  }

  /*
   * Parses a PR's body for issue numbers claimed to be closed/fixed etc.
   * For ex: Closes #100, fixes #150, Resolve: #121 woud return [100, 150, 121]
   * Check https://help.github.com/en/articles/closing-issues-using-keywords for more info
   *
   * @param body - PR's body
   *
   * @returns - an array of issues parsed
   */
  function parseIssues(body: string): number[] {
    const closeKeywordsCapture: string = CLOSE_KEYWORDS.join("|");
    const testRegexString: string = `(${closeKeywordsCapture})(:\\s*|\\s+)#(\\d+)`;

    const testRegex: RegExp = new RegExp(testRegexString, "g");

    let matches: RegExpMatchArray | null;

    let issues: number[] = [];
    do {
      matches = testRegex.exec(body);

      if (matches) {
        issues.push(parseInt(matches[3], 10));
      }
    } while (matches);

    return issues;
  }

  /*
   * Checks if an issue has `Pending PR` label if the issue exists
   *
   * @param context - Probot webhook context
   *
   * @param issue - GitHub Issue number to check for
   *
   * @returns - returns true if the issue has a `Pending PR` label, false if it doesn't
   */
  async function hasLabelPendingPR(
    context: Context,
    issue: number
  ): Promise<boolean> {
    let payload = context.repo({ number: issue });

    return await context.github.issues.get(payload).then(resp => {
      if (resp.status === http_status_codes.OK) {
        for (let label of resp.data.labels) {
          if (
            label.name.toLowerCase() ===
            CONFIG.PENDING_PR_LABEL.name.toLowerCase()
          ) {
            return true;
          }
        }
      }
      return false;
    });
  }

  /*
   * Checks if an issue exists and is open
   *
   * @param context - Probot webhook context
   *
   * @param issue - GitHub Issue number to check for
   *
   * @returns - returns true if the issue is open, false if it doesn't
   */
  async function isOpenIssue(
    context: Context,
    issue: number
  ): Promise<boolean> {
    let payload = context.repo({ number: issue });

    return await context.github.issues.get(payload).then(resp => {
      if (
        resp.status === http_status_codes.OK &&
        resp.data.state.toLowerCase() === "open"
      ) {
        return true;
      }
      return false;
    });
  }
}
