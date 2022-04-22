"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Object = void 0;
var Object_1 = __importDefault(require("../Object"));
var User_1 = __importDefault(require("../User"));
exports.Object = new Object_1.default('user/:id', ['patch']);
// Get a user
exports.Object.get = function (_user, data, _a) {
    var id = _a.id;
    return new Promise(function (resolve) {
        resolve(User_1.default.from_identifier(id).to_public());
    });
};
// Modify a user
exports.Object.patch = function (user, data, _a) {
    var id = _a.id;
    return new Promise(function (resolve) {
        if (!user)
            return;
        var target = User_1.default.from_identifier(id);
        if (target.id !== user.id)
            throw new Error('You can only modify your own user');
        var username = data.username, password = data.password, email = data.email, avatar = data.avatar, bio = data.bio, location = data.location, website = data.website, pronouns = data.pronouns;
        if (username)
            target.username = username;
        if (password)
            target.password = password;
        if (email)
            target.email = email;
        if (avatar)
            target.avatar = avatar;
        if (bio)
            target.bio = bio;
        if (location)
            target.location = location;
        if (website)
            target.website = website;
        if (pronouns)
            target.pronouns = pronouns;
        resolve(target);
    });
};
//# sourceMappingURL=User_Existing.js.map