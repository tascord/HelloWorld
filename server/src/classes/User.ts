import bcrypt from "bcrypt";
import { stringify } from "querystring";
import { databases } from "../helpers/data";
import Post, { PostData } from "./Post";

type Session = {
    token: string
    expires: Date
}

type UserOpts = {

    id: string
    handle: string

    username: string
    password: string

    email: string
    session: Session

}

type SafeUserData = {

    id: string
    username: string
    handle: string
    session: Session | undefined

}

export type ProfileData = {

    id: string

    username: string
    handle: string

    followers: SafeUserData[]
    following: SafeUserData[]

    bio: string
    avatar: string

    posts: PostData[]

}

export type RawProfileData = {

    id: string

    followers: string[]
    following: string[]

    bio: string
    avatar: string

    posts: string[]

}

export default class User {

    id: string;
    handle: string;

    username: string;
    password: string;

    email: string;
    session: Session;

    constructor(opts: UserOpts) {

        this.id = opts.id;
        this.handle = opts.handle;

        this.username = opts.username;
        this.password = opts.password;
        this.email = opts.email;

        this.session = opts.session;

    }

    save() {

        return databases.users.set(this.id, {

            id: this.id,
            handle: this.handle,
            username: this.username,
            password: this.password,
            email: this.email,
            session: this.session

        });

    }

    get_profile_data(): ProfileData {

        const data = databases.profiles.get(this.id) as {
            id: string,
            following: string[],
            followers: string[],
            posts: string[],
            bio: string,
            avatar: string,
        };

        return {

            id: data.id,
            username: this.username,
            handle: this.handle,
            bio: data.bio,
            avatar: data.avatar,

            following: (
                data.following
                    .map(id => databases.users.get(id) as SafeUserData)
            ),

            followers: (
                data.followers
                    .map(id => databases.users.get(id) as SafeUserData)
            ),

            posts: (
                data.posts
                    .map(id => databases.posts.get(id) as PostData)
            )

        };

    }

    safe(owned = false): SafeUserData {

        return {

            id: this.id,
            handle: this.handle,
            username: this.username,
            session: owned ? this.session : undefined

        }

    }

    extend_session() {

        this.session.expires = new Date(Date.now() + 20 * 60 * 1000);
        this.save();

    }

    static create_session(): Session {

        // Create session
        const session: Session = {
            token: '',
            expires: new Date(Date.now() + 20 * 60 * 1000)
        }

        // Session token unique-ify
        do { session.token = Array(32).fill('x').join('').replace(/x/g, () => (Math.random() * 16 | 0).toString(16)); }
        while (User.get_user_by_session_token(session.token))

        return session;

    }

    static get_user_by_id(id: string): User | undefined {

        if (!databases.users.has(id)) return undefined;

        const opts = databases.users.get(id) as {

            id: string
            handle: string

            username: string
            password: string

            email: string
            session: Session
        };

        return new User(opts);

    }

    static get_user_by_session_token(token: string): User | undefined {

        const user = databases.users.all()
            .map((raw: { ID: string }) => databases.users.get(raw.ID))
            .find((user: UserOpts) => user.session.token === token && new Date(user.session.expires) > new Date());

        return user ? new User(user) : undefined;

    }

    static get_user_by_handle(handle: string): User | undefined {

        const user = databases.users.all()
            .map((raw: { ID: string }) => databases.users.get(raw.ID))
            .find((user: UserOpts) => user.handle.toLowerCase() === handle.toLowerCase());

        return user ? new User(user) : undefined;

    }

    static get_user_by_email(email: string): User | undefined {

        const user = databases.users.all()
            .map((raw: { ID: string }) => databases.users.get(raw.ID))
            .find((user: UserOpts) => user.email.toLowerCase() === email.toLowerCase());

        return user ? new User(user) : undefined;

    }

    static search_users(query: string): User[] {

        return databases.users.all()
            .map((raw: { ID: string }) => databases.users.get(raw.ID))
            .filter((user: UserOpts) => {

                const regex = new RegExp(query, "gi");
                return regex.test(user.handle) || regex.test(user.username) || user.id === query;

            })
            .map((user: UserOpts) => new User(user))
            .slice(0, 10);

    }

    static register_user(handle: string, password: string, email: string): Promise<User> {

        // Handle requirements
        if (handle.length < 3) return Promise.reject("Username must be at least 3 characters");
        if (handle.length > 25) return Promise.reject("Username must be at most 25 characters");

        // Password requirements
        if (password.length < 8) return Promise.reject("Password must be at least 8 characters");
        if (password.length > 128) return Promise.reject("Password must be at most 128 characters");
        if (!/[0-9]/.test(password)) return Promise.reject("Your password must contain at least one digit");
        if (!/[A-Z]/.test(password)) return Promise.reject("Your password must contain at least one capital letter");
        if (!/[a-z]/.test(password)) return Promise.reject("Your password must contain at least one lowercase letter");

        // Email requirements
        if (!/^.+?@.+?\..+$/.test(email)) return Promise.reject("Invalid email format");

        // Check for already existing email
        if (User.get_user_by_email(email) instanceof User) return Promise.reject("Email already taken");

        // Check for already existing handle
        if (User.get_user_by_handle(handle) instanceof User) return Promise.reject("Handle already taken");

        // Generate ID
        let id = Number(Date.now().toPrecision());
        while (databases.users.has(id)) id = id++;

        // Generate Username
        let username = handle.replace(/_/g, ' ');

        // Hash password
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        // Create user (Writing everything in full because almost used 'password' instead of 'hash')
        const user = new User({
            id: id.toString(),
            username: username,
            handle: handle,
            password: hash,
            email: email,
            session: User.create_session()
        });

        const profile_data: RawProfileData = {
            id: user.id,
            following: [],
            followers: [],
            posts: [],
            bio: "I'm new around here. Say hi!",
            avatar: '',
        }

        user.save();
        databases.profiles.set(user.id, profile_data);
        return Promise.resolve(user);

    }

    static login_user(handle: string, password: string): Promise<User> {

        const user = User.get_user_by_handle(handle);
        if (!(user instanceof User)) return Promise.reject("No user exists with that handle");

        // Compare password
        if (!bcrypt.compareSync(password, user.password)) return Promise.reject("Incorrect password");

        // Create session
        user.session = User.create_session();
        user.save();

        return Promise.resolve(user);

    }

}