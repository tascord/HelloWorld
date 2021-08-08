"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var data_1 = require("../helpers/data");
var User = /** @class */ (function () {
    function User(opts) {
        this.id = opts.id;
        this.handle = opts.handle;
        this.username = opts.username;
        this.password = opts.password;
        this.email = opts.email;
        this.session = opts.session;
    }
    User.prototype.save = function () {
        return data_1.databases.users.set(this.id, {
            id: this.id,
            handle: this.handle,
            username: this.username,
            password: this.password,
            email: this.email,
            session: this.session
        });
    };
    User.prototype.get_profile_data = function () {
        var data = data_1.databases.profiles.get(this.id);
        return {
            id: data.id,
            username: this.username,
            handle: this.handle,
            bio: data.bio,
            avatar: data.avatar,
            following: (data.following
                .map(function (id) { return data_1.databases.users.get(id); })),
            followers: (data.followers
                .map(function (id) { return data_1.databases.users.get(id); })),
            posts: (data.posts
                .map(function (id) { return data_1.databases.posts.get(id); }))
        };
    };
    User.prototype.safe = function (owned) {
        if (owned === void 0) { owned = false; }
        return {
            id: this.id,
            handle: this.handle,
            username: this.username,
            session: owned ? this.session : undefined
        };
    };
    User.prototype.extend_session = function () {
        this.session.expires = new Date(Date.now() + 20 * 60 * 1000);
        this.save();
    };
    User.create_session = function () {
        // Create session
        var session = {
            token: '',
            expires: new Date(Date.now() + 20 * 60 * 1000)
        };
        // Session token unique-ify
        do {
            session.token = Array(32).fill('x').join('').replace(/x/g, function () { return (Math.random() * 16 | 0).toString(16); });
        } while (User.get_user_by_session_token(session.token));
        return session;
    };
    User.get_user_by_id = function (id) {
        if (!data_1.databases.users.has(id))
            return undefined;
        var opts = data_1.databases.users.get(id);
        return new User(opts);
    };
    User.get_user_by_session_token = function (token) {
        var user = data_1.databases.users.all()
            .map(function (raw) { return data_1.databases.users.get(raw.ID); })
            .find(function (user) { return user.session.token === token && new Date(user.session.expires) > new Date(); });
        return user ? new User(user) : undefined;
    };
    User.get_user_by_handle = function (handle) {
        var user = data_1.databases.users.all()
            .map(function (raw) { return data_1.databases.users.get(raw.ID); })
            .find(function (user) { return user.handle.toLowerCase() === handle.toLowerCase(); });
        return user ? new User(user) : undefined;
    };
    User.get_user_by_email = function (email) {
        var user = data_1.databases.users.all()
            .map(function (raw) { return data_1.databases.users.get(raw.ID); })
            .find(function (user) { return user.email.toLowerCase() === email.toLowerCase(); });
        return user ? new User(user) : undefined;
    };
    User.search_users = function (query) {
        return data_1.databases.users.all()
            .map(function (raw) { return data_1.databases.users.get(raw.ID); })
            .filter(function (user) {
            var regex = new RegExp(query, "gi");
            return regex.test(user.handle) || regex.test(user.username) || user.id === query;
        })
            .map(function (user) { return new User(user); })
            .slice(0, 10);
    };
    User.register_user = function (handle, password, email) {
        // Handle requirements
        if (handle.length < 3)
            return Promise.reject("Username must be at least 3 characters");
        if (handle.length > 25)
            return Promise.reject("Username must be at most 25 characters");
        // Password requirements
        if (password.length < 8)
            return Promise.reject("Password must be at least 8 characters");
        if (password.length > 128)
            return Promise.reject("Password must be at most 128 characters");
        if (!/[0-9]/.test(password))
            return Promise.reject("Your password must contain at least one digit");
        if (!/[A-Z]/.test(password))
            return Promise.reject("Your password must contain at least one capital letter");
        if (!/[a-z]/.test(password))
            return Promise.reject("Your password must contain at least one lowercase letter");
        // Email requirements
        if (!/^.+?@.+?\..+$/.test(email))
            return Promise.reject("Invalid email format");
        // Check for already existing email
        if (User.get_user_by_email(email) instanceof User)
            return Promise.reject("Email already taken");
        // Check for already existing handle
        if (User.get_user_by_handle(handle) instanceof User)
            return Promise.reject("Handle already taken");
        // Generate ID
        var id = Number(Date.now().toPrecision());
        while (data_1.databases.users.has(id))
            id = id++;
        // Generate Username
        var username = handle.replace(/_/g, ' ');
        // Hash password
        var hash = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        // Create user (Writing everything in full because almost used 'password' instead of 'hash')
        var user = new User({
            id: id.toString(),
            username: username,
            handle: handle,
            password: hash,
            email: email,
            session: User.create_session()
        });
        var profile_data = {
            id: user.id,
            following: [],
            followers: [],
            posts: [],
            bio: "I'm new around here. Say hi!",
            avatar: '',
        };
        user.save();
        data_1.databases.profiles.set(user.id, profile_data);
        return Promise.resolve(user);
    };
    User.login_user = function (handle, password) {
        var user = User.get_user_by_handle(handle);
        if (!(user instanceof User))
            return Promise.reject("No user exists with that handle");
        // Compare password
        if (!bcrypt_1.default.compareSync(password, user.password))
            return Promise.reject("Incorrect password");
        // Create session
        user.session = User.create_session();
        user.save();
        return Promise.resolve(user);
    };
    return User;
}());
exports.default = User;
//# sourceMappingURL=User.js.map