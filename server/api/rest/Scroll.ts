import Community from "../Community";
import Message from "../Message";
import RestObject from "../Object";

export const Object = new RestObject('scroll/:location', ['get']);

// Get top posts
Object.get = (user, data, { location }) => new Promise((resolve) => {
    if (!user) return;

    const page = (data.page ?? 0) + 1;

    switch (location) {

        case 'home':
            const posts = user.communities.map(c => c.messages.slice(page * 10, (page + 1) * 10));
            const flat = posts.flat().map(p => p.to_public());
            const sorted = flat.sort((a, b) => b.created - a.created);
            return resolve(sorted);

        default:
            throw new Error('Invalid location');

    }

})