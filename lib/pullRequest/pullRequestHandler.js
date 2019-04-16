"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes = __importStar(require("http-status-codes"));
var config_1 = require("../config");
var PullRequestHandler;
(function(PullRequestHandler) {
  // For more information, check:
  // https://help.github.com/en/articles/closing-issues-using-keywords
  var CLOSE_KEYWORDS = [
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
  function onOpenRequestHandler(context) {
    return __awaiter(this, void 0, void 0, function() {
      var body, issues, _loop_1, _i, issues_1, issue;
      var _this = this;
      return __generator(this, function(_a) {
        body = context.payload.pull_request.body.toLowerCase();
        issues = parseIssues(body);
        _loop_1 = function(issue) {
          isOpenIssue(context, issue).then(function(resp) {
            return __awaiter(_this, void 0, void 0, function() {
              var payload;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    if (!resp) return [3 /*break*/, 2];
                    payload = context.repo({
                      number: issue,
                      labels: [config_1.CONFIG.PENDING_PR_LABEL.name]
                    });
                    return [
                      4 /*yield*/,
                      context.github.issues.addLabels(payload)
                    ];
                  case 1:
                    _a.sent();
                    _a.label = 2;
                  case 2:
                    return [2 /*return*/];
                }
              });
            });
          });
        };
        for (_i = 0, issues_1 = issues; _i < issues_1.length; _i++) {
          issue = issues_1[_i];
          _loop_1(issue);
        }
        return [2 /*return*/];
      });
    });
  }
  PullRequestHandler.onOpenRequestHandler = onOpenRequestHandler;
  function onEditRequestHandler(context) {
    return __awaiter(this, void 0, void 0, function() {
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, onOpenRequestHandler(context)];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  }
  PullRequestHandler.onEditRequestHandler = onEditRequestHandler;
  function onCloseRequestHandler(context) {
    return __awaiter(this, void 0, void 0, function() {
      var body, issues, _loop_2, _i, issues_2, issue;
      var _this = this;
      return __generator(this, function(_a) {
        body = context.payload.pull_request.body.toLowerCase();
        issues = parseIssues(body);
        _loop_2 = function(issue) {
          hasLabelPendingPR(context, issue).then(function(resp) {
            return __awaiter(_this, void 0, void 0, function() {
              var payload;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    if (!resp) return [3 /*break*/, 2];
                    payload = context.repo({
                      number: issue,
                      labels: [config_1.CONFIG.PENDING_PR_LABEL.name]
                    });
                    return [
                      4 /*yield*/,
                      context.github.issues.removeLabels(payload)
                    ];
                  case 1:
                    _a.sent();
                    _a.label = 2;
                  case 2:
                    return [2 /*return*/];
                }
              });
            });
          });
        };
        for (_i = 0, issues_2 = issues; _i < issues_2.length; _i++) {
          issue = issues_2[_i];
          _loop_2(issue);
        }
        return [2 /*return*/];
      });
    });
  }
  PullRequestHandler.onCloseRequestHandler = onCloseRequestHandler;
  /*
   * Parses a PR's body for issue numbers claimed to be closed/fixed etc.
   * For ex: Closes #100, fixes #150, Resolve: #121 woud return [100, 150, 121]
   * Check https://help.github.com/en/articles/closing-issues-using-keywords for more info
   *
   * @param body - PR's body
   *
   * @returns - an array of issues parsed
   */
  function parseIssues(body) {
    var closeKeywordsCapture = CLOSE_KEYWORDS.join("|");
    var testRegexString = "(" + closeKeywordsCapture + ")(:\\s*|\\s+)#(\\d+)";
    var testRegex = new RegExp(testRegexString, "g");
    var matches;
    var issues = [];
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
  function hasLabelPendingPR(context, issue) {
    return __awaiter(this, void 0, void 0, function() {
      var payload;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            payload = context.repo({ number: issue });
            return [
              4 /*yield*/,
              context.github.issues.get(payload).then(function(resp) {
                if (resp.status === http_status_codes.OK) {
                  for (
                    var _i = 0, _a = resp.data.labels;
                    _i < _a.length;
                    _i++
                  ) {
                    var label = _a[_i];
                    if (
                      label.name.toLowerCase() ===
                      config_1.CONFIG.PENDING_PR_LABEL.name.toLowerCase()
                    ) {
                      return true;
                    }
                  }
                }
                return false;
              })
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
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
  function isOpenIssue(context, issue) {
    return __awaiter(this, void 0, void 0, function() {
      var payload;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            payload = context.repo({ number: issue });
            return [
              4 /*yield*/,
              context.github.issues.get(payload).then(function(resp) {
                if (
                  resp.status === http_status_codes.OK &&
                  resp.data.state.toLowerCase() === "open"
                ) {
                  return true;
                }
                return false;
              })
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  }
})(
  (PullRequestHandler =
    exports.PullRequestHandler || (exports.PullRequestHandler = {}))
);
//# sourceMappingURL=pullRequestHandler.js.map
