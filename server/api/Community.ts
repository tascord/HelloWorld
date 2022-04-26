import { Tables, generate_id } from "./Data";
import Message from "./Message";
import { Action, DefaultPermissions, UserHasPermissionInCommunity } from "./Permissions";
import User from "./User";

export type Audit = {
    action: Action;
    initiator_id: string;
    target_id?: string;
}

export default class Community {
    readonly id: string;
    private _name: string;
    private _description: string;
    private _owner_id: string;

    private _created: Date;
    private _users: User[];
    private _messages: Message[];

    private _audit_log: Audit[];

    constructor(data: { [key: string]: any }) {
        this.id = data.id;
        this._name = data.name;
        this._description = data.description;
        this._owner_id = data.owner_id;

        this._created = new Date(data.created ?? Date.now());
        this._users = (data.users ?? []).map((u: string) => User.from_id(u)); // TODO: Don't use class instances here.
        this._messages = (data.messages ?? []).map((m: string) => Message.from_id(m)); // TODO: Don't use class instances here.

        this._audit_log = data.audit_log ?? [];

        if (!this.id) throw new Error('Community must have an ID');
        if (!this._name) throw new Error('Community must have a name');
        if (!this._description) throw new Error('Community must have a description');
        if (!this._owner_id) throw new Error('Community must have an owner');

    }

    /* ------------------------------------------------- */

    static from_id(id: string) {
        if (Tables.Users.has(id) || Tables.Username_ID_Map.has(id)) return Community.for_user(User.from_identifier(id));
        if (!Tables.Communities.has(id)) throw new Error(`Community with id '${id}' does not exist`);
        return new Community(Tables.Communities.get(id));
    }

    /* ------------------------------------------------- */

    static for_user(user: User) {
        return new Community({
            id: '0',
            name: user.display_name ?? user.username,
            description: `${user.display_name ?? user.username}'s personal community`,
            owner_id: user.id,
            created: user.created,
            users: [user.id],
            messages: user.wall.map(m => m.id).concat(user.messages.map(m => m.id)),
            audit_log: []
        })
    }

    /* ------------------------------------------------- */

    to_public(user?: User) {

        // TODO: Private communities
        if (user && !UserHasPermissionInCommunity(user, this, 'community_read')) throw new Error('User does not have permission to view community');

        return {
            id: this.id,
            name: this._name,
            description: this._description,
            owner_id: this._owner_id,

            created: this._created,
            users: this._users.map(u => u.id),
            messages: this._messages.map(m => m.id),

            audit_log: this._audit_log
        };
    }

    /* ------------------------------------------------- */

    save() {

        if (this.id === '0') {
            User.from_id(this._owner_id).wall = this._messages;
            return;
        }

        Tables.Communities.set(this.id, {
            id: this.id,
            name: this._name,
            description: this._description,
            owner_id: this._owner_id,

            created: this._created.getTime(),
            users: this._users.map(u => u.id),
            messages: this._messages.map(m => m.id),

            audit_log: this._audit_log
        });
    }

    /* ------------------------------------------------- */

    static create(user: User, name: string, description: string) {

        const id = generate_id();

        user.permissions = {
            ...user.permissions,
            [id]: DefaultPermissions.lead
        }

        const community = new Community({
            id, owner_id: user.id, name: 'community', description: 'community'
        })

        try {
            community.rename(user, name);
            community.set_description(user, description);
        }

        catch (e) {
            Tables.Communities.delete(id);
            delete user.permissions[id];
            user.save();

            throw e;
        }

        user.join_community(community);
        return community;

    }

    /* ------------------------------------------------- */

    private post_audit(action: Action, initiator: User, target?: User) {
        this._audit_log.push({
            action,
            initiator_id: initiator.id,
            target_id: target?.id
        })

        this.save();
    }

    /* ------------------------------------------------- */

    get name() { return this._name; }
    get description() { return this._description; }
    get owner_id() { return this._owner_id; }
    get created() { return this._created; }
    get users() { return this._users; }
    get messages() { return this._messages; }
    get audit_log() { return this._audit_log; }

    /* ------------------------------------------------- */

    rename(user: User, name: string) {

        if (!UserHasPermissionInCommunity(user, this, 'community_lead_rename')) throw new Error('User does not have permission to rename community');

        if (name.length < 3 || name.length > 20) throw new Error('Community name must be between 3 and 20 characters long');
        if (name.match(/[^a-zA-Z0-9_ ]/)) throw new Error('Community name must only contain letters, numbers, spaces and underscores');

        this._name = name;
        this.save();

    }


    set_description(user: User, description: string) {

        if (!UserHasPermissionInCommunity(user, this, 'community_lead_description')) throw new Error('User does not have permission to set community description');

        if (description.length < 3 || description.length > 100) throw new Error('Community description must be between 3 and 100 characters long');

        this._description = description;
        this.save();

    }

    transfer_ownership(user: User, new_owner: User) {

        if (!UserHasPermissionInCommunity(user, this, 'community_lead_transfer')) throw new Error('User does not have permission to transfer community ownership');

        const old_owner = User.from_id(this._owner_id);
        old_owner.permissions = {
            ...old_owner.permissions,
            [this.id]: DefaultPermissions.moderator
        }

        new_owner.permissions = {
            ...new_owner.permissions,
            [this.id]: DefaultPermissions.lead
        }

        this._owner_id = new_owner.id;
        this.save();

        this.post_audit('community_lead_transfer', user, new_owner);

    }


}