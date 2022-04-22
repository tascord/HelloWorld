import RestObject from "../Object";
import User from "../User";

export const Object = new RestObject('user/:id', ['patch']);

// Get a user
Object.get = (_user, data, { id }) => new Promise((resolve) => {
    resolve(User.from_identifier(id).to_public());
});

// Modify a user
Object.patch = (user, data, { id }) => new Promise((resolve) => {

    if (!user) return;

    const target = User.from_identifier(id);
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
