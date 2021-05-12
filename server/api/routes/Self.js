const { User, GetUserByToken } = require('../User');

module.exports = function GetSelf(i, o) {

    let { token } = i.body;
    if(!token) return o.status(400).end('No token');
    
    let user = GetUserByToken(token);
    if(!user) return o.status(400).end('Invalid token');

    return o.json(new User(user).scrub());

}