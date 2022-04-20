"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Object = void 0;
var Object_1 = __importDefault(require("../Object"));
exports.Object = new Object_1.default('me', ['get']);
// Get self
exports.Object.get = function (user, data) { return new Promise(function (resolve) {
    if (!user)
        return;
    resolve(user.to_public());
}); };
//# sourceMappingURL=Me.js.map