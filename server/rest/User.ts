import RestObject from "../Object";
import User from "../User";

export const Object = new RestObject('user/:id', ['post']);

// Get a user
Object.get = (_user, data) => new Promise((resolve) => {
    resolve(User.from_identifier(data.id));
});

// Modify a user
Object.patch = (_user, data) => new Promise((resolve) => {
    const target = User.from_identifier(data.id);
    const { username, password, email, avatar, bio, location, website, pronouns } = data;
    
    if(username) target.username = username;
    if(password) target.password = password;
    if(email) target.email = email;
    if(avatar) target.avatar = avatar;
    if(bio) target.bio = bio;
    if(location) target.location = location;
    if(website) target.website = website;
    if(pronouns) target.pronouns = pronouns;
        
    resolve(target);

});

// Create a user
Object.put = (user, data) => new Promise((resolve) => {
    const { username, password, email } = data;
    
    if(!username) throw new Error('Username is required');
    if(!password) throw new Error('Password is required');
    if(!email) throw new Error('Email is required');

});