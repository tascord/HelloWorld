"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var chalk_1 = __importDefault(require("chalk"));
exports.Logger = {
    error: function (message) {
        console.log(chalk_1.default.redBright("[\uD83D\uDCA5] ".concat(chalk_1.default.bold("ERROR"), " :: ")) +
            chalk_1.default.whiteBright(message));
    },
    warning: function (message) {
        console.log(chalk_1.default.yellowBright("[\uD83D\uDCA2] ".concat(chalk_1.default.bold("WARNING"), " :: ")) +
            chalk_1.default.whiteBright(message));
    },
    info: function (message, emoji) {
        if (emoji === void 0) { emoji = '🔨'; }
        console.log(chalk_1.default.cyanBright("[".concat(emoji, "] ").concat(chalk_1.default.bold("INFO"), " :: ")) +
            chalk_1.default.whiteBright(message));
    }
};
//# sourceMappingURL=Logger.js.map