const { User, GetUserById } = require('../User');

module.exports = function GetSelf(i, o) {

    let { id } = i.body;
    if(!id) return o.status(400).end('No id');
    
    let user = GetUserById(id);
    if(!user) return o.status(400).end('Invalid id');

    return o.json(new User(user).scrub());

}