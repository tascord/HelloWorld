"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Object = void 0;
var Community_1 = __importDefault(require("../Community"));
var Object_1 = __importDefault(require("../Object"));
exports.Object = new Object_1.default('community', ['put']);
// Create a community
exports.Object.put = function (user, data) { return new Promise(function (resolve) {
    if (!user)
        return;
    var name = data.name, description = data.description;
    if (!name)
        throw new Error('Name is required');
    if (!description)
        throw new Error('Description is required');
    resolve(Community_1.default.create(user, name, description).to_public());
}); };
//# sourceMappingURL=Community.js.map