"use strict";
var pullRequestHandler_1 = require("./pullRequest/pullRequestHandler");
var installationHandler_1 = require("./installation/installationHandler");
module.exports = function(app) {
  app.on(
    "installation.created",
    installationHandler_1.InstallationHandler.onInstallation
  );
  app.on(
    "installation_repositories.added",
    installationHandler_1.InstallationHandler.onInstallationRepoAdded
  );
  app.on(
    "pull_request.opened",
    pullRequestHandler_1.PullRequestHandler.onOpenRequestHandler
  );
  app.on(
    "pull_request.edited",
    pullRequestHandler_1.PullRequestHandler.onEditRequestHandler
  );
  app.on(
    "pull_request.closed",
    pullRequestHandler_1.PullRequestHandler.onCloseRequestHandler
  );
  app.on(
    "pull_request.reopened",
    pullRequestHandler_1.PullRequestHandler.onOpenRequestHandler
  );
};
//# sourceMappingURL=index.js.map
