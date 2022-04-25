"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Object = void 0;
var Community_1 = __importDefault(require("../Community"));
var Message_1 = __importDefault(require("../Message"));
var Object_1 = __importDefault(require("../Object"));
exports.Object = new Object_1.default('community/:id/post', ['put']);
// Create a post
exports.Object.put = function (user, data, _a) {
    var id = _a.id;
    return new Promise(function (resolve) {
        if (!user)
            return;
        var community = Community_1.default.from_id(id);
        var message = Message_1.default.create(data.title, data.content, community, user);
        resolve(message.to_public());
    });
};
//# sourceMappingURL=Post.js.map