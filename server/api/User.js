const Table = require('./Data');
const Users = Table('Users');

const User = class User {

    /**
     * User constructor
     * @param {Object} opts Options for user 
     * @param {?User} from User that instantiated construction
     */
    constructor(opts = {}, from = { id: null }) {

        this.username = 'username' in opts ? opts['username'] : null;
        this.id = 'id' in opts ? opts['id'] : null;
        this.handle = 'handle' in opts ? opts['handle'] : null;
        this.live = 'live' in opts ? opts['live'] : false;
        this.auth = 'auth' in opts ? opts['auth'] : null;
        this.flags = 'flags' in opts ? opts['flags'] : [];
        this.token = 'token' in opts ? opts['token'] : {
            generated: Date.now(),
            value: GenerateToken()
        };

        this.avatar = 'avatar' in opts ? opts['avatar'] : null;
        // this.avatar = 'https://cdn.discordapp.com/avatars/205811939861856257/f4b880e557ae7c6e4442843ed21ecc12.png?size=2048';

        this.followers = 'followers' in opts ? opts['followers'].map(u => {
            if (u === from.id) return from;

            let data = GetUserById(u);
            if (data === undefined) return
            return new User(data, this);

        }).filter(u => u !== null) : [];

        this.following = 'following' in opts ? opts['following'].map(u => {
            if (u === from.id) return from;

            let data = GetUserById(u);
            if (data === undefined) return null;
            return new User(data, this);

        }).filter(u => u !== null) : [];

        if (!this.username) throw new Error('No username provided.');
        if (!this.id) throw new Error('No id provided.')
        if (!this.handle) throw new Error('No handle provided.');
        if (!this.auth) throw new Error('No auth code provided.');

    }

    /**
     * Flattens User to object
     * @returns {Object} Flattened object
     */
    serialize = () => {
        return {

            handle: this.handle,
            username: this.username,
            id: this.id,
            live: this.live,
            auth: this.auth,
            avatar: this.avatar,
            token: this.token,

            followers: this.followers.map(f => f.id),
            following: this.following.map(f => f.id)

        }
    }

    /**
     * Removes sensitive data
     * @returns {Object} Flattened, 'scrubbed' user
     */
    scrub = () => {

        let data = this.serialize();

        delete data['auth'];
        delete data['token'];

        return data;

    }

    /**
     * Updates / Creates user in database
     */
    save = () => Users.set(this.id, this.serialize());

    /**
     * Generates session token
     */
    generateToken = () => {
        this.token = {
            generated: Date.now(),
            value: GenerateToken()
        };
    }

    /**
     * Checks token equality and ensures sessions aren't kept for longer than 10m without use
     * @param {String} token Token to check 
     * @returns {Boolean} Token validity
     */
    validateToken = (token) => this.token.value === token && Date.now() - this.token.generated < 600000;

    /**
     * Extends the currently active token
     */
    extendToken = () => this.token.generated = Date.now();

    /**
     * User flags
     */
    static FLAGS = {
        SYSTEM: 'SYSTEM',
        BOT: 'BOT',
        VERIFIED: 'VERIFIED',
        STAFF: 'STAFF'
    }

}

/**
 * Fetches a users data by auth token
 * @param {String} auth Auth token 
 * @returns {Object|undefined} User data or undefined
 */
const GetUserByAuth = function (auth) {

    return Users.all()
        .map(r => Users.get(r.ID))
        .find(u => u.auth === auth);

}

/**
 * Fetches a users data by session token
 * @param {String} token Session token 
 * @returns {Object|undefined} User data or undefined
 */
const GetUserByToken = function (token) {

    return Users.all()
        .map(r => Users.get(r.ID))
        .find(u => (u.token || { value: null }).value === token);

}

/**
 * Fetches a users data by ID
 * @param {String} id User ID 
 * @returns {Object|undefined} User data or undefined
 */
const GetUserById = function (id) {
    return Users.has(id) ? Users.get(id) : undefined;
}

/**
 * Fetches a users data by handle
 * @param {String} handle User handle 
 * @returns {Object|undefined} User data or undefined
 */
const GetUserByHandle = function (handle) {
    return Users.all()
        .map(r => Users.get(r.ID))
        .find(u => u.handle.toLowerCase() === handle.toLowerCase());
}

/**
 * Generates an unused valid User ID
 * @returns {String} Valid ID
 */
const GenerateID = function () {

    let id;
    const alpha = '1234567890';

    do {
        id = 'XXXXXXXXXXXXXX'.replace(/X/g, () => {
            return alpha[Math.floor(Math.random() * alpha.length)];
        })
    }

    while (
        Users.has(id)
    )

    return id;
}

/**
 * Generates a random, unused handle
 * @returns {String} Handle
 */
const GenerateHandle = function () {

    let handle;
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    do {
        handle = 'XXXXXXXXXXXX'.replace(/X/g, () => {
            return alpha[Math.floor(Math.random() * alpha.length)];
        })
    }

    while (
        GetUserByHandle(handle) !== undefined
    )

    return handle;
}

/**
 * Generates an unused valid session token (value)
 * @returns {String} Valid Token
 */
const GenerateToken = function () {

    let token;
    const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=+.';

    do {
        token = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'.replace(/X/g, () => {
            return alpha[Math.floor(Math.random() * alpha.length)];
        })
    }

    while (
        GetUserByToken(token) !== undefined
    )

    return token;

}

/**
 * Module exports
 */
module.exports = {
    User,
    GetUserByAuth,
    GetUserByToken,
    GenerateID,
    GenerateHandle,
    GenerateToken,
    GetUserById,
    GetUserByHandle
}