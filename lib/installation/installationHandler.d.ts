import { Context } from "probot";
export declare namespace InstallationHandler {
    function onInstallation(context: Context): Promise<void>;
    function onInstallationRepoAdded(context: Context): Promise<void>;
}
