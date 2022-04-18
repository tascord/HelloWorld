import RestObject from "../Object";
import User from "../User";

export const Object = new RestObject('user/:id', ['post']);

// Get a user
Object.get = (user, data) => new Promise((resolve, reject) => {
    resolve(User.from_identifier(data.id));
});

// Modify a user
Object.patch = (user, data) => new Promise((resolve, reject) => {
    const target = User.from_identifier(data.id);
    
});

// Create a user
Object.put = (user, data) => new Promise((resolve, reject) => {

});