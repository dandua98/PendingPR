import { Application } from "probot"; // eslint-disable-line no-unused-vars
import { PullRequestHandler } from "./PullRequest/pullRequestHandler";

export = (app: Application) => {
  app.on("pull_request.opened", PullRequestHandler.onOpenRequestHandler);
  app.on("pull_request.edited", PullRequestHandler.onEditRequestHandler);
  app.on("pull_request.closed", PullRequestHandler.onCloseRequestHandler);
  app.on("pull_request.reopened", PullRequestHandler.onOpenRequestHandler);
};
