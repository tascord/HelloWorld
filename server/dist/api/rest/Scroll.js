"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Object = void 0;
var Object_1 = __importDefault(require("../Object"));
exports.Object = new Object_1.default('scroll/:location', ['get']);
// Get top posts
exports.Object.get = function (user, data, _a) {
    var location = _a.location;
    return new Promise(function (resolve) {
        var _a;
        if (!user)
            return;
        var page = ((_a = data.page) !== null && _a !== void 0 ? _a : 0) + 1;
        switch (location) {
            case 'home':
                var posts = user.communities.map(function (c) { return c.messages.slice(page * 10, (page + 1) * 10); });
                var flat = posts.flat().map(function (p) { return p.to_public(); });
                var sorted = flat.sort(function (a, b) { return b.created - a.created; });
                return resolve(sorted);
            default:
                throw new Error('Invalid location');
        }
    });
};
//# sourceMappingURL=Scroll.js.map