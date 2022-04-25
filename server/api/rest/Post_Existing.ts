import Community from "../Community";
import RestObject from "../Object";
import { UserHasPermissionInCommunity } from "../Permissions";

export const Object = new RestObject('community/:id/post/:post', ['patch', 'put', 'delete']);

// Get a post
Object.get = (_user, _data, { id, post }) => new Promise((resolve) => {
    const community = Community.from_id(id);
    const message = community.messages.find(m => m.id === post);
    if (!message) throw new Error("No message exists with that ID");
    resolve(message.to_public());
});

// Edit a post
Object.patch = (user, data, { id, post }) => new Promise((resolve) => {

    if (!user) return;
    const community = Community.from_id(id);
    const message = community.messages.find(m => m.id === post);

    if (!message) throw new Error("No message exists with that ID");
    message.content = data.content;

});

// Delete a post
Object.put = (user, data, { id, post }) => new Promise((resolve) => {

    if (!user) return;
    const community = Community.from_id(id);
    const message = community.messages.find(m => m.id === post);

    if (!message) throw new Error("No message exists with that ID");

    if (
        // Deleting own message
        (user.id === message.author_id && UserHasPermissionInCommunity(user, community, 'community_delete')) ||

        // Deleting as a moderation action
        UserHasPermissionInCommunity(user, community, 'community_helper_delete')
    ) {
        message.delete();
    }

    else {
        throw new Error("No permission to delete Message.")
    }

});