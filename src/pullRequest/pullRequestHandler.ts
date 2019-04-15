import { Context } from "probot";

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

  export async function onOpenRequestHandler(context: Context) {}

  export async function onEditRequestHandler(context: Context) {}

  export async function onCloseRequestHandler(context: Context) {}

  /*
   * Parses a PR description for issue numbers claimed to be closed/fixed etc.
   * For ex: Closes #100, fixes #150, Resolve: #121 woud return [100, 150, 121]
   * Check https://help.github.com/en/articles/closing-issues-using-keywords for more info
   *
   * @param context - Probot webhook context
   *
   * @param issue - GitHub Issue number to check for
   *
   * @returns - an array of issues parsed
   */
  function parseIssues(description: string): number[] {
    return [];
  }

  /*
   * Checks if an issue number found while parsing is valid (that is, it exists).
   * This is required since you could add a random issue number in description which doesn't
   * necessarily exist.
   *
   * @param context - Probot webhook context
   *
   * @param issue - GitHub Issue number to check for
   *
   * @returns - returns true if the issue number in params is a valid issue, false if it isn't
   */
  function isValidIssue(context: Context, issue: number): boolean {
    return true;
  }

  /*
   * Checks if an issue has `Pending PR` label
   *
   * @param context - Probot webhook context
   *
   * @param issue - GitHub Issue number to check for
   *
   * @returns - returns true if the issue has a `Pending PR` label, false if it doesn't
   */
  function isIssuePendingPR(context: Context, issue: number): boolean {
    return false;
  }

  /*
   * Checks if an issue is open
   *
   * @param context - Probot webhook context
   *
   * @param issue - GitHub Issue number to check for
   *
   * @returns - returns true if the issue is open, false if it doesn't
   */
  function isIssueOpen(context: Context, issue: number): boolean {
    return true;
  }
}
