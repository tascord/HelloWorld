"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Data_1 = require("./Data");
var Message_1 = __importDefault(require("./Message"));
var Permissions_1 = require("./Permissions");
var User_1 = __importDefault(require("./User"));
var Community = /** @class */ (function () {
    function Community(data) {
        var _a, _b, _c, _d;
        this.id = data.id;
        this._name = data.name;
        this._description = data.description;
        this._owner_id = data.owner_id;
        this._created = new Date((_a = data.created) !== null && _a !== void 0 ? _a : Date.now());
        this._users = ((_b = data.users) !== null && _b !== void 0 ? _b : []).map(function (u) { return User_1.default.from_id(u); }); // TODO: Don't use class instances here.
        this._messages = ((_c = data.messages) !== null && _c !== void 0 ? _c : []).map(function (m) { return Message_1.default.from_id(m); }); // TODO: Don't use class instances here.
        this._audit_log = (_d = data.audit_log) !== null && _d !== void 0 ? _d : [];
        if (!this.id)
            throw new Error('Community must have an ID');
        if (!this._name)
            throw new Error('Community must have a name');
        if (!this._description)
            throw new Error('Community must have a description');
        if (!this._owner_id)
            throw new Error('Community must have an owner');
    }
    /* ------------------------------------------------- */
    Community.from_id = function (id) {
        if (!Data_1.Tables.Communities.has(id))
            throw new Error("Community with id '".concat(id, "' does not exist"));
        return new Community(Data_1.Tables.Communities.get(id));
    };
    /* ------------------------------------------------- */
    Community.prototype.to_public = function (user) {
        // TODO: Private communities
        if (user && !(0, Permissions_1.UserHasPermissionInCommunity)(user, this, 'community_read'))
            throw new Error('User does not have permission to view community');
        return {
            id: this.id,
            name: this._name,
            description: this._description,
            owner_id: this._owner_id,
            created: this._created,
            users: this._users.map(function (u) { return u.id; }),
            messages: this._messages.map(function (m) { return m.id; }),
            audit_log: this._audit_log
        };
    };
    /* ------------------------------------------------- */
    Community.prototype.save = function () {
        Data_1.Tables.Communities.set(this.id, {
            id: this.id,
            name: this._name,
            description: this._description,
            owner_id: this._owner_id,
            created: this._created,
            users: this._users.map(function (u) { return u.id; }),
            messages: this._messages.map(function (m) { return m.id; }),
            audit_log: this._audit_log
        });
    };
    /* ------------------------------------------------- */
    Community.generate_id = function () {
        var id;
        do {
            id = Date.now().toString();
        } while (Data_1.Tables.Communities.has(id));
        return id;
    };
    Community.create = function (user, name, description) {
        var _a;
        var id = this.generate_id();
        user.permissions = __assign(__assign({}, user.permissions), (_a = {}, _a[id] = Permissions_1.DefaultPermissions.lead, _a));
        var community = new Community({
            id: id,
            owner_id: user.id, name: '', description: ''
        });
        try {
            community.rename(user, name);
            community.set_description(user, description);
        }
        catch (e) {
            Data_1.Tables.Communities.delete(id);
            delete user.permissions[id];
            user.save();
            throw e;
        }
        return community;
    };
    /* ------------------------------------------------- */
    Community.prototype.post_audit = function (action, initiator, target) {
        this._audit_log.push({
            action: action,
            initiator_id: initiator.id,
            target_id: target === null || target === void 0 ? void 0 : target.id
        });
        this.save();
    };
    Object.defineProperty(Community.prototype, "name", {
        /* ------------------------------------------------- */
        get: function () { return this._name; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Community.prototype, "description", {
        get: function () { return this._description; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Community.prototype, "owner_id", {
        get: function () { return this._owner_id; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Community.prototype, "created", {
        get: function () { return this._created; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Community.prototype, "users", {
        get: function () { return this._users; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Community.prototype, "messages", {
        get: function () { return this._messages; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Community.prototype, "audit_log", {
        get: function () { return this._audit_log; },
        enumerable: false,
        configurable: true
    });
    /* ------------------------------------------------- */
    Community.prototype.rename = function (user, name) {
        if (!(0, Permissions_1.UserHasPermissionInCommunity)(user, this, 'community_lead_rename'))
            throw new Error('User does not have permission to rename community');
        if (name.length < 3 || name.length > 20)
            throw new Error('Community name must be between 3 and 20 characters long');
        if (name.match(/[^a-zA-Z0-9_]/))
            throw new Error('Community name must only contain letters, numbers, and underscores');
        this._name = name;
        this.save();
    };
    Community.prototype.set_description = function (user, description) {
        if (!(0, Permissions_1.UserHasPermissionInCommunity)(user, this, 'community_lead_description'))
            throw new Error('User does not have permission to set community description');
        if (description.length < 3 || description.length > 100)
            throw new Error('Community description must be between 3 and 100 characters long');
        this._description = description;
        this.save();
    };
    Community.prototype.transfer_ownership = function (user, new_owner) {
        var _a, _b;
        if (!(0, Permissions_1.UserHasPermissionInCommunity)(user, this, 'community_lead_transfer'))
            throw new Error('User does not have permission to transfer community ownership');
        var old_owner = User_1.default.from_id(this._owner_id);
        old_owner.permissions = __assign(__assign({}, old_owner.permissions), (_a = {}, _a[this.id] = Permissions_1.DefaultPermissions.moderator, _a));
        new_owner.permissions = __assign(__assign({}, new_owner.permissions), (_b = {}, _b[this.id] = Permissions_1.DefaultPermissions.lead, _b));
        this._owner_id = new_owner.id;
        this.save();
        this.post_audit('community_lead_transfer', user, new_owner);
    };
    return Community;
}());
exports.default = Community;
//# sourceMappingURL=Community.js.map