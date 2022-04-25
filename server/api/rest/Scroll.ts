import Community from "../Community";
import RestObject from "../Object";
import User from "../User";

export const Object = new RestObject('scroll/:location', ['post']);

// Get top posts
Object.post = (user, data, { location }) => new Promise((resolve) => {
    if (!user) return;

    const page = (data.page ?? 0) + 1;

    // Community & User
    if (/^[0-9]{13}$/.test(location)) {

        const posts = Community.from_id(location).messages.slice(page * 10, (page + 1) * 10);
        const flat = posts.flat().map(p => p.to_public());
        const sorted = flat.sort((a, b) => b.created - a.created);
        return resolve(sorted);

    }

    switch (location) {

        case 'home':
            const posts = user.communities.concat(user.followers.map(u => Community.for_user(u))).map(c => c.messages.slice(page * 10, (page + 1) * 10));
            const flat = posts.flat().map(p => p.to_public());
            const sorted = flat.sort((a, b) => b.created - a.created);
            return resolve(sorted);

        default:
            throw new Error('Invalid location');

    }

})