"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Object = void 0;
var Community_1 = __importDefault(require("../Community"));
var Object_1 = __importDefault(require("../Object"));
exports.Object = new Object_1.default('scroll/:location', []);
// Get top posts
exports.Object.post = function (user, data, _a) {
    var location = _a.location;
    return new Promise(function (resolve) {
        var _a;
        var page = Math.min(((_a = data.page) !== null && _a !== void 0 ? _a : 0), 0);
        // Community & User
        if (/^[0-9]{13}$/.test(location)) {
            var posts = Community_1.default.from_id(location).messages.slice(page * 10, (page + 1) * 10);
            var flat = posts.flat().map(function (p) { return p.to_public(); });
            var sorted = flat.sort(function (a, b) { return b.created - a.created; });
            return resolve(sorted);
        }
        switch (location) {
            case 'home':
                if (!user)
                    throw new Error('Not logged in');
                var posts = user.communities.concat(user.followers.map(function (u) { return Community_1.default.for_user(u); })).map(function (c) { return c.messages.slice(page * 10, (page + 1) * 10); });
                var flat = posts.flat().map(function (p) { return p.to_public(); });
                var sorted = flat.sort(function (a, b) { return b.created - a.created; });
                return resolve(sorted);
            default:
                throw new Error('Invalid location');
        }
    });
};
//# sourceMappingURL=Scroll.js.map