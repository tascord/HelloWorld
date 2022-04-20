import RestObject from "../Object";
import User from "../User";

export const Object = new RestObject('user', ['patch']);

// Get a user
Object.get = (_user, data) => new Promise((resolve) => {
    if (!data.id) throw new Error('No ID provided');
    resolve(User.from_identifier(data.id).to_public());
});

// Modify a user
Object.patch = (user, data) => new Promise((resolve) => {

    if (!user) return;

    const target = User.from_identifier(data.id);
    if (target.id !== user.id) throw new Error('You can only modify your own user');

    const { username, password, email, avatar, bio, location, website, pronouns } = data;

    if (username) target.username = username;
    if (password) target.password = password;
    if (email) target.email = email;
    if (avatar) target.avatar = avatar;
    if (bio) target.bio = bio;
    if (location) target.location = location;
    if (website) target.website = website;
    if (pronouns) target.pronouns = pronouns;

    resolve(target);

});

// Create a user
Object.put = (_user, data) => new Promise((resolve) => {
    const { username, password, email } = data;

    if (username === undefined) throw new Error('Username is required');
    if (password === undefined) throw new Error('Password is required');
    if (email === undefined) throw new Error('Email is required');

    resolve({ token: User.create(username, email, password).to_token() });
});

// Login
Object.post = (_user, data) => new Promise((resolve) => {
    const { username, password } = data;

    if (!username) throw new Error('Username is required');
    if (!password) throw new Error('Password is required');

    const user = User.from_username(username);
    if (!user.password_matches(password)) throw new Error('Invalid password');

    resolve({ token: user.to_token() });

})