import Community from "../Community";
import RestObject from "../Object";

export const Object = new RestObject('community/:id', ['patch', 'put']);

// Get a community
Object.get = (_user, data, { id }) => new Promise((resolve) => {
    resolve(Community.from_id(id).to_public(_user));
});

// Modify a community
Object.patch = (user, data, { id }) => new Promise((resolve) => {

    if (!user) return;
    const community = Community.from_id(id);

    if (data.name) community.rename(user, data.name);
    if (data.description) community.set_description(user, data.description);
    if (data.owner_id) community.transfer_ownership(user, data.owner_id);

    resolve(community);

});