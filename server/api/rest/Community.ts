import Community from "../Community";
import RestObject from "../Object";

export const Object = new RestObject('community', ['put']);

// Create a community
Object.put = (user, data) => new Promise((resolve) => {

    if (!user) return;
    const { name, description } = data;

    if (!name) throw new Error('Name is required');
    if (!description) throw new Error('Description is required');

    resolve(Community.create(user, name, description).to_public());

});