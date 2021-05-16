const { User, GetUserById, GetUserByHandle } = require('../User');

module.exports = function GetSelf(i, o) {

    let { id, handle } = i.body;
    if(!id && !handle) return o.status(400).end('No id or handle');

    let user;

    if(id) {
        user = GetUserById(id);
        if(!user) return o.status(400).end('Invalid id');
    }

    else {
        user = GetUserByHandle(handle);
        if(!user) return o.status(400).end('Invalid handle');
    }

    return o.json(new User(user).scrub());

}