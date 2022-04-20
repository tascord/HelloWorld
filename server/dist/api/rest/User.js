"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Object = void 0;
var Object_1 = __importDefault(require("../Object"));
var User_1 = __importDefault(require("../User"));
exports.Object = new Object_1.default('user', ['patch']);
// Get a user
exports.Object.get = function (_user, data) { return new Promise(function (resolve) {
    if (!data.id)
        throw new Error('No ID provided');
    resolve(User_1.default.from_identifier(data.id).to_public());
}); };
// Modify a user
exports.Object.patch = function (user, data) { return new Promise(function (resolve) {
    if (!user)
        return;
    var target = User_1.default.from_identifier(data.id);
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
}); };
// Create a user
exports.Object.put = function (_user, data) { return new Promise(function (resolve) {
    var username = data.username, password = data.password, email = data.email;
    if (username === undefined)
        throw new Error('Username is required');
    if (password === undefined)
        throw new Error('Password is required');
    if (email === undefined)
        throw new Error('Email is required');
    resolve({ token: User_1.default.create(username, email, password).to_token() });
}); };
// Login
exports.Object.post = function (_user, data) { return new Promise(function (resolve) {
    var username = data.username, password = data.password;
    if (!username)
        throw new Error('Username is required');
    if (!password)
        throw new Error('Password is required');
    var user = User_1.default.from_username(username);
    if (!user.password_matches(password))
        throw new Error('Invalid password');
    resolve({ token: user.to_token() });
}); };
//# sourceMappingURL=User.js.map