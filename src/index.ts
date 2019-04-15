import { Application } from "probot"; // eslint-disable-line no-unused-vars
import { PullRequestHandler } from "./pullRequest/pullRequestHandler";
import { InstallationHandler } from "./installation/installationHandler";

export = (app: Application) => {
  app.on("installation.created", InstallationHandler.onInstallation);
  app.on(
    "installation_repositories.added",
    InstallationHandler.onInstallationRepoAdded
  );
  app.on("pull_request.opened", PullRequestHandler.onOpenRequestHandler);
  app.on("pull_request.edited", PullRequestHandler.onEditRequestHandler);
  app.on("pull_request.closed", PullRequestHandler.onCloseRequestHandler);
  app.on("pull_request.reopened", PullRequestHandler.onOpenRequestHandler);
};
