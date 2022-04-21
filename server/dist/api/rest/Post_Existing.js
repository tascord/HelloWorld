"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Object = void 0;
var Community_1 = __importDefault(require("../Community"));
var Object_1 = __importDefault(require("../Object"));
var Permissions_1 = require("../Permissions");
exports.Object = new Object_1.default('community/:id/post/:post', ['patch', 'put', 'delete']);
// Get a post
exports.Object.get = function (_user, data, _a) {
    var id = _a.id, post = _a.post;
    return new Promise(function (resolve) {
        var community = Community_1.default.from_id(id);
        var message = community.messages.find(function (m) { return m.id === post; });
        if (!message)
            throw new Error("No message exists with that ID");
        resolve(message.to_public());
    });
};
// Edit a post
exports.Object.patch = function (user, data, _a) {
    var id = _a.id, post = _a.post;
    return new Promise(function (resolve) {
        if (!user)
            return;
        var community = Community_1.default.from_id(id);
        var message = community.messages.find(function (m) { return m.id === post; });
        if (!message)
            throw new Error("No message exists with that ID");
        message.content = data.content;
    });
};
// Delete a post
exports.Object.put = function (user, data, _a) {
    var id = _a.id, post = _a.post;
    return new Promise(function (resolve) {
        if (!user)
            return;
        var community = Community_1.default.from_id(id);
        var message = community.messages.find(function (m) { return m.id === post; });
        if (!message)
            throw new Error("No message exists with that ID");
        if (
        // Deleting own message
        (user.id === message.author_id && (0, Permissions_1.UserHasPermissionInCommunity)(user, community, 'community_delete')) ||
            // Deleting as a moderation action
            (0, Permissions_1.UserHasPermissionInCommunity)(user, community, 'community_helper_delete')) {
            message.delete();
        }
        else {
            throw new Error("No permission to delete Message.");
        }
    });
};
//# sourceMappingURL=Post_Existing.js.map