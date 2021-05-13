const { User, GetUserByToken } = require('../User');

module.exports = function GetSelf(i, o) {

    let { token } = i.body;
    if(!token) return o.status(400).end('No token');
    
    let user = GetUserByToken(token);
    if(!user) return o.status(400).end('Invalid token');

    let data = new User(user).scrub();
    console.log(data);
    return o.json(data);

}