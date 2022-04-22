import { createHash } from "crypto";
import Community from "./Community";
import { Tables } from "./Data";
import Message from "./Message";
import Signer from "./Signer";

export default class User {
    readonly id: string;
    private _username: string;
    private _password: string;
    private _display_name: string;
    private _email: string;

    private _communities: Community[];

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
    private _wall: Message[];

    constructor(data: { [key: string]: any }) {
        this.id = data.id;
        this._username = data.username;
        this._password = data.password;
        this._display_name = data.display_name;
        this._email = data.email;

        this._communities = (data.communities ?? []).map((c: string) => Community.from_id(c));

        this._permissions = data.permissions ?? {};
        this._created = new Date(data.created ?? Date.now());
        this._mfa = data.mfa ?? undefined;
        this._email_verified = data.email_verified ?? false;
        this._messages = (data.messages ?? []).map((m: string) => Message.from_id(m));
        this._avatar = data.avatar ?? 'default';
        this._bio = data.bio ?? '';
        this._location = data.location ?? '';
        this._website = data.website ?? '';
        this._pronouns = data.pronouns ?? [];

        this._wall = (data.wall ?? []).map((m: string) => Message.from_id(m));

        if (!this.id) throw new Error('User must have an ID');
        if (!this._username) throw new Error('Username is required');
        if (!this._email) throw new Error('Email is required');
        if (!this._display_name) throw new Error('Display name is required');
        if (!this._password) throw new Error('Password is required');
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

    static from_token(token: string) {
        if (!Signer.verify(token)) throw new Error('Unable to verify token');

        const data = Signer.decode(token)?.payload as any;
        if (!data) throw new Error('Unable to decode token');

        const user = User.from_id(data.id);
        if (!user.password_matches(data.password) || !user.email_matches(data.email)) throw new Error('Invalid token');

        return user;
    }

    /* ------------------------------------------------- */

    to_public() {
        return {
            id: this.id,
            username: this._username,
            display_name: this._display_name,

            communities: this._communities.map(c => c.id),

            permissions: this.permissions,
            created: this.created.getTime(),
            email_verified: this.email_verified,
            messages: this._messages.map(m => m.id),
            avatar: this._avatar,
            bio: this._bio,
            location: this._location,
            website: this._website,
            pronouns: this._pronouns,

            wall: this._wall.map(m => m.id),
        }
    }

    to_token() {
        return Signer.sign({
            id: this.id,
            email: this._email,
            password: this._password,
        })
    }

    /* ------------------------------------------------- */

    save() {
        Tables.Users.set(this.id, {
            id: this.id,
            username: this._username,
            password: this._password,
            display_name: this._display_name,
            email: this._email,

            communities: this._communities.map(c => c.id),

            permissions: this._permissions,
            created: this._created.getTime(),
            mfa: this._mfa,
            email_verified: this._email_verified,
            messages: this._messages.map(m => m.id),
            avatar: this._avatar,
            bio: this._bio,
            location: this._location,
            website: this._website,
            pronouns: this._pronouns,

            wall: this._wall.map(m => m.id),
        });
    }

    /* ------------------------------------------------- */

    static create(username: string, email: string, password: string) {

        const id = this.generate_id();

        const user = new User({
            id, username: 'account', email: 'account@account.com', password: 'account', display_name: 'account'
        })

        try {
            user.username = username;
            user.email = email;
            user.password = password;
            user.display_name = username;
        }

        catch (e) {
            if (Tables.Username_ID_Map.get(username) === id) Tables.Username_ID_Map.delete(username);
            Tables.Users.delete(user.id);

            throw e;
        }

        return user;

    }

    private static generate_id() {
        let id: string;
        do { id = Date.now().toString(); }
        while (Tables.Users.has(id));
        return id;
    }

    /* ------------------------------------------------- */

    public password_matches(password: string) {
        return password === this._password || createHash('sha256').update(password).digest('hex') === this._password;
    }

    public email_matches(email: string) {
        return this._email === email;
    }

    /* ------------------------------------------------- */

    join_community(community: Community) {
        this._communities.push(community);
        this.save();
    }

    /* ------------------------------------------------- */

    get username() { return this._username }
    get permissions() { return this._permissions }
    get created() { return this._created }
    get mfa() { return this._mfa }
    get email_verified() { return this._email_verified }
    get messages() { return this._messages }
    get avatar() { return this._avatar }
    get bio() { return this._bio }
    get location() { return this._location }
    get website() { return this._website }
    get pronouns() { return this._pronouns }
    get communities() { return this._communities }
    get wall() { return this._wall }

    set username(username: string) {

        username = username.toLowerCase();

        if (username.length < 3 || username.length > 20) throw new Error('Username must be between 3 and 20 characters');
        if (!/^[a-z0-9_]+$/.test(username)) throw new Error('Username must only contain letters, numbers, and underscores');
        if (Tables.Username_ID_Map.has(username) && Tables.Username_ID_Map.get(username).id !== this.id) throw new Error('Username is already taken');

        Tables.Username_ID_Map.delete(this._username);
        Tables.Username_ID_Map.set(username, this.id);

        this._username = username;
        this.save();

    }

    set email(email: string) {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) throw new Error('Invalid email');
        this._email_verified = false;
        this.save();
        // TODO: this.send_email_verification();
    }

    set password(password: string) {
        if (password.length < 8) throw new Error('Password must be at least 8 characters');
        if (password.length > 64) throw new Error('Password must be at most 64 characters');
        this._password = createHash('sha256').update(password).digest('hex');
        this.save();
    }

    set display_name(display_name: string) {
        if (display_name.length < 3 || display_name.length > 20) throw new Error('Display name must be between 3 and 20 characters');
        this._display_name = display_name;
        this.save();
    }

    set wall(wall: Message[]) {
        this._wall = wall;
        this.save();
    }

    set permissions(permissions: { [community_id: string]: number }) {
        this._permissions = permissions;
        this.save();
    }

    set mfa(mfa: string | undefined) {
        this._mfa = mfa;
        this.save();
    }

    set email_verified(email_verified: boolean) {
        this._email_verified = email_verified;
        this.save();
    }

    set avatar(avatar_id: string) {

        // TODO: check if avatar exists
        this._avatar = avatar_id;
        this.save();
    }

    set bio(bio: string) {
        this._bio = bio;
        this.save();
    }

    set location(location: string) {
        this._location = location;
        this.save();
    }

    set website(website: string) {
        this._website = website;
        this.save();
    }

    set pronouns(pronouns: string[]) {
        this._pronouns = pronouns;
        this.save();
    }

    set messages(messages: Message[]) {
        this._messages = messages;
        this.save();
    }

    /* ------------------------------------------------- */


}