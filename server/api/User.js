const Table = require('./Data');
const Users = Table('Users');

const User = class User {

    constructor(opts = {}, from = { id: null }) {

        this.username = 'username' in opts ? opts['username'] : null;
        this.id = 'id' in opts ? opts['id'] : null;
        this.handle = 'handle' in opts ? opts['handle'] : null;
        this.live = 'live' in opts ? opts['live'] : false;
        this.auth = 'auth' in opts ? opts['auth'] : null;
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

    scrub = () => {

        let data = this.serialize();

        delete data['auth'];
        delete data['token'];

        return data;

    }

    save = () => Users.set(this.id, this.serialize());

    generateToken = () => {
        this.token = {
            generated: Date.now(),
            value: GenerateToken()
        };
    }

    validateToken = (token) => this.token.value === token && Date.now() - this.token.generated < 600000;
    extendToken = () => this.token.generated = Date.now();

}

const GetUserByAuth = function (auth) {

    return Users.all()
        .map(r => Users.get(r.ID))
        .find(u => u.auth === auth);

}

const GetUserByToken = function (token) {

    return Users.all()
        .map(r => Users.get(r.ID))
        .find(u => (u.token || { value: null }).value === token);

}

const GetUserById = function (id) {
    return Users.has(id) ? Users.get(id) : undefined;
}

const GetUserByHandle = function (handle) {
    return Users.all()
        .map(r => Users.get(r.ID))
        .find(u => u.handle === handle);
}

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