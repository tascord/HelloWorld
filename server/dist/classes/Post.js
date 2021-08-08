"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../helpers/data");
var User_1 = __importDefault(require("./User"));
var Post = /** @class */ (function () {
    function Post(opts) {
        this.id = opts.id;
        this.author = opts.author;
        this.title = opts.title;
        this.body = opts.body;
        this.likes = opts.likes;
    }
    Post.get_post_by_id = function (id) {
        if (!data_1.databases.posts.has(id))
            return undefined;
        var data = data_1.databases.posts.get(id);
        return new Post({
            id: data.id,
            title: data.title,
            body: data.body,
            likes: (data.likes
                .map(function (id) { return User_1.default.get_user_by_id(id); })
                .filter(function (user) { return user instanceof User_1.default; })),
            author: User_1.default.get_user_by_id(data.author)
        });
    };
    return Post;
}());
exports.default = Post;
//# sourceMappingURL=Post.js.map