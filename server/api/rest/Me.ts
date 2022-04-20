import RestObject from "../Object";

export const Object = new RestObject('me', ['get']);

// Get self
Object.get = (user, data) => new Promise((resolve) => {
    if(!user) return;
    resolve(user.to_public());
});
