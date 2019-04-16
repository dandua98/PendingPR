"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var http_status_codes = __importStar(require("http-status-codes"));
var InstallationHandler;
(function (InstallationHandler) {
    function onInstallation(context) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, repo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = context.payload.repositories;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        repo = _a[_i];
                        return [4 /*yield*/, createLabel(context, repo)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    InstallationHandler.onInstallation = onInstallation;
    function onInstallationRepoAdded(context) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, repo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = context.payload.repositories_added;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        repo = _a[_i];
                        return [4 /*yield*/, createLabel(context, repo)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    InstallationHandler.onInstallationRepoAdded = onInstallationRepoAdded;
    /*
     * Creates a label on a repo if it doesn't have one
     *
     * @param context - Probot webhook context
     *
     * @param repo: repository payload
     */
    function createLabel(context, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, archived;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            owner: getOwner(repo.full_name),
                            repo: repo.name,
                            name: config_1.CONFIG.PENDING_PR_LABEL.name,
                            color: config_1.CONFIG.PENDING_PR_LABEL.color,
                            description: config_1.CONFIG.PENDING_PR_LABEL.description
                        };
                        return [4 /*yield*/, isArchived(context, getOwner(repo.full_name), repo.name)];
                    case 1:
                        archived = _a.sent();
                        return [4 /*yield*/, context.github.issues
                                .getLabel(payload)
                                .then(function (resp) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(resp.status !== http_status_codes.OK && !archived)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, context.github.issues.createLabel(payload)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })
                                .catch(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!archived) return [3 /*break*/, 2];
                                            return [4 /*yield*/, context.github.issues.createLabel(payload)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    /*
     * Returns a repo's owner from fullName
     *
     * @param fullName - repo full name, i.e username/repo
     *
     * @returns - owner i.e username
     */
    function getOwner(fullName) {
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
    function isArchived(context, owner, repo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.github.repos
                            .get({ owner: owner, repo: repo })
                            .then(function (resp) {
                            return resp.data.archived;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
})(InstallationHandler = exports.InstallationHandler || (exports.InstallationHandler = {}));
//# sourceMappingURL=installationHandler.js.map