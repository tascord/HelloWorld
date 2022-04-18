import { Tables } from "./Data";
import Message from "./Message";

export default class User {
    readonly id: string;
    private _username: string;
    private _password: string;
    private _email: string;
    private _permissions: { [community_id: string]: number };
    private _created: Date;
    private _mfa?: string;
    private _email_verified: boolean;
    private _messages: Message[];
    private _avatar: string;
    private _bio: string;
    private _location: string;
    private _website: string;
    private _pronouns: string[];

    constructor(data: { [key: string]: any }) {
        this.id = data.id;
        this._username = data.username;
        this._password = data.password;
        this._email = data.email;
        this._permissions = data.permissions;
        this._created = new Date(data.created);
        this._mfa = data.mfa;
        this._email_verified = data.email_verified;
        this._messages = (data.messages ?? []).map((m: any) => new Message(m));
        this._avatar = data.avatar ?? 'default';
        this._bio = data.bio ?? '';
        this._location = data.location ?? '';
        this._website = data.website ?? '';
        this._pronouns = data.pronouns ?? [];
    }

    /* ------------------------------------------------- */

    static from_id(id: string) {
        if (!Tables.Users.has(id)) throw new Error(`User with id '${id}' does not exist`);
        return new User(Tables.Users.get(id));
    }

    static from_username(username: string) {
        if (!Tables.Username_ID_Map.has(username)) throw new Error(`User with username '${username}' does not exist`);
        return new User(Tables.Users.get(Tables.Username_ID_Map.get(username)));
    }

    static from_identifier(identifier: string) {
        if (identifier.length === 13 && /^[0-9]+$/.test(identifier)) return User.from_id(identifier);
        if (identifier.length > 3 && identifier.length < 20) return User.from_username(identifier);
        throw new Error(`Invalid identifier '${identifier}'`);
    }

    /* ------------------------------------------------- */

    save() {

    }

    /* ------------------------------------------------- */

    get username() { return this._username }
    get email() { return this._email }
    get roles() { return this._permissions }
    get created() { return this._created }
    get mfa() { return this._mfa }
    get email_verified() { return this._email_verified }
    get messages() { return this._messages }
    get avatar() { return this._avatar }
    get bio() { return this._bio }
    get location() { return this._location }
    get website() { return this._website }
    get pronouns() { return this._pronouns }

    set username(username: string) {
        if (username.length < 3 || username.length > 20) throw new Error('Username must be between 3 and 20 characters');
        if (!/^[a-zA-Z0-9_]+$/.test(username)) throw new Error('Username must only contain letters, numbers, and underscores');
    }


}