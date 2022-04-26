import Community from "../Community";
import RestObject from "../Object";

export const Object = new RestObject('scroll/:location', []);

// Get top posts
Object.post = (user, data, { location }) => new Promise((resolve) => {

    const page = Math.min((data.page ?? 0), 0);

    // Community & User
    if (/^[0-9]{13}$/.test(location)) {

        const posts = Community.from_id(location).messages.slice(page * 10, (page + 1) * 10);
        const flat = posts.flat().map(p => p.to_public());
        const sorted = flat.sort((a, b) => b.created - a.created);
        return resolve(sorted);

    }

    switch (location) {

        case 'home':
            if(!user) throw new Error('Not logged in');
            const posts = user.communities.concat(user.followers.map(u => Community.for_user(u))).map(c => c.messages.slice(page * 10, (page + 1) * 10));
            const flat = posts.flat().map(p => p.to_public());
            const sorted = flat.sort((a, b) => b.created - a.created);
            return resolve(sorted);

        default:
            throw new Error('Invalid location');

    }

})