import RestObject from "../Object";
import User from "../User";

export const Object = new RestObject('user/:id', ['patch']);

// Get a user
Object.get = (_user, data) => new Promise((resolve) => {
    if(!data.id) throw new Error('No ID provided');
    resolve(User.from_identifier(data.id).to_public());
});

// Modify a user
Object.patch = (user, data) => new Promise((resolve) => {

    if(!user) return;

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

    if (!username) throw new Error('Username is required');
    if (!password) throw new Error('Password is required');
    if (!email) throw new Error('Email is required');

    resolve(User.create(username, email, password).to_public());
});

// Login
Object.post = (_user, data) => new Promise((resolve) => {
    const { username, password } = data;

    if (!username) throw new Error('Username is required');
    if (!password) throw new Error('Password is required');

    const user = User.from_username(username);
    if (!user.password_matches(password)) throw new Error('Invalid password');

    resolve(user.to_token());

})