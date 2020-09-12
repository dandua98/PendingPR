import { Context } from "probot";
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
    "resolved",
  ];

  export async function onOpenRequestHandler(context: Context) {
    const body: string = context.payload.pull_request.body.toLocaleLowerCase();
    await addLabelToIssues(context, parseIssues(body));
  }

  export async function onEditRequestHandler(context: Context) {
    // if there are changes to pull request's body
    if (context.payload.changes && context.payload.changes.body) {
      const old_body: string = context.payload.changes.body.from.toLocaleLowerCase();
      const new_body: string = context.payload.pull_request.body.toLocaleLowerCase();

      const old_issues: number[] = parseIssues(old_body);
      const new_issues: number[] = parseIssues(new_body);

      const to_remove: number[] = [];
      for (let issue of old_issues) {
        if (!new_issues.includes(issue)) {
          to_remove.push(issue);
        }
      }

      const to_add: number[] = [];
      for (let issue of new_issues) {
        if (!old_issues.includes(issue)) {
          to_add.push(issue);
        }
      }

      await Promise.all([
        addLabelToIssues(context, to_add),
        removeLabelFromIssues(context, to_remove),
      ]);
    }
  }

  export async function onCloseRequestHandler(context: Context) {
    const body: string = context.payload.pull_request.body.toLowerCase();
    await removeLabelFromIssues(context, parseIssues(body));
  }

  /*
   * Adds Pending PR label to issues.
   *
   * @param context - Probot webhook context
   *
   * @param issues - Github issues numbers in the context repo to check for
   *
   */
  async function addLabelToIssues(context: Context, issues: number[]) {
    await Promise.all(
      issues.map(async (issue: number) => {
        let isOpen: boolean = await isOpenIssue(context, issue);
        if (isOpen) {
          let payload = context.repo({
            number: issue,
            labels: [CONFIG.PENDING_PR_LABEL.name],
          });

          await context.github.issues.addLabels(payload);
        }
      })
    );
  }

  /*
   * Removes Pending PR label from issues.
   *
   * @param context - Probot webhook context
   *
   * @param issues - Github issues numbers in the context repo to check for
   *
   */
  async function removeLabelFromIssues(context: Context, issues: number[]) {
    await Promise.all(
      issues.map(async (issue: number) => {
        let hasLabel: boolean = await hasLabelPendingPR(context, issue);
        if (hasLabel) {
          let payload = context.repo({
            number: issue,
            name: CONFIG.PENDING_PR_LABEL.name,
          });

          await context.github.issues.removeLabel(payload);
        }
      })
    );
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
    body = body.toLocaleLowerCase();

    const closeKeywordsCapture: string = CLOSE_KEYWORDS.join("|");
    const testRegexString: string = `(${closeKeywordsCapture})(:\\s*|\\s+)#(\\d+)`;

    const testRegex: RegExp = new RegExp(testRegexString, "g");

    let matches: RegExpMatchArray | null;

    let issues: Set<number> = new Set();
    do {
      matches = testRegex.exec(body);

      if (matches) {
        issues.add(parseInt(matches[3], 10));
      }
    } while (matches);

    return Array.from(issues);
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

    let resp = await context.github.issues.get(payload);
    if (resp.status === 200) {
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
  }

  /*
   * Checks if an issue exists and is open
   *
   * @param context - Probot webhook context
   *
   * @param issue - GitHub Issue number to check for
   *
   * @returns - returns true if the issue is open, false if it
   *  isn't/doesn't exist
   */
  async function isOpenIssue(
    context: Context,
    issue: number
  ): Promise<boolean> {
    let payload = context.repo({ number: issue });

    let resp = await context.github.issues.get(payload);
    // check if issue is open and not a pull request (pull requests are a
    // subset of issues)
    if (
      resp.status === 200 &&
      resp.data.state.toLowerCase() === "open" &&
      !resp.data.pull_request
    ) {
      return true;
    }
    return false;
  }
}
