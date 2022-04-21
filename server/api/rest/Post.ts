import Community from "../Community";
import Message from "../Message";
import RestObject from "../Object";

export const Object = new RestObject('community/:id/post', ['put']);

// Create a post
Object.put = (user, data, { id }) => new Promise((resolve) => {
    if (!user) return;
    const community = Community.from_id(id);
    const message = Message.create(data.content, community, user);
    resolve(message.to_public());
})