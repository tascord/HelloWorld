const { User, GetUserByToken, GetUserById } = require('../User');

module.exports = function GetSelf(i, o) {

    let { token, other } = i.body;
    if(!token) return o.status(400).end('No token');
    if(!other) return o.status(400).end('No other');

    let user = GetUserByToken(token);
    if(!user) return o.status(400).end('Invalid token');

    let target = GetUserById(other);
    if(!target) return o.status(400).end('Invalid other');

    if(user.id === target.id) return o.status(404).end('You cannot unfollow yourself');

    if(user.following.indexOf(other) == -1) return o.status(400).end('Not following');
    
    user = new User(user);
    user.following = user.following.filter(f => f.id !== other);

    user.save();
    return o.json(user.scrub());

}