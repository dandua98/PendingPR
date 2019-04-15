import { Context } from "probot";
export declare namespace PullRequestHandler {
    function onOpenRequestHandler(context: Context): Promise<void>;
    function onEditRequestHandler(context: Context): Promise<void>;
    function onCloseRequestHandler(context: Context): Promise<void>;
}
