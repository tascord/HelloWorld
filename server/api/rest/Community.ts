import Community from "../Community";
import RestObject from "../Object";

export const Object = new RestObject('community/:id', ['patch', 'put']);

// Get a community
Object.get = (_user, data) => new Promise((resolve) => {
    if (!data.id) throw new Error('No ID provided');
    resolve(Community.from_id(data.id).to_public(_user));
});

// Modify a community
Object.patch = (user, data) => new Promise((resolve) => {

    if (!user) return;
    const community = Community.from_id(data.id);

    if (data.name) community.rename(user, data.name);
    if (data.description) community.set_description(user, data.description);
    if (data.owner_id) community.transfer_ownership(user, data.owner_id);

    resolve(community);

});

// Create a community
Object.put = (user, data) => new Promise((resolve) => {

    if (!user) return;
    const { name, description } = data;

    if(!name) throw new Error('Name is required');
    if(!description) throw new Error('Description is required');

    resolve(Community.create(user, name, description).to_public());

});