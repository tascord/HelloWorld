const { GetUserByToken, User } = require('../User');
const Table = require('../Data');
const Users = Table('Users');

module.exports = function Search(i, o) {

    let { token, query } = i.body;
    if(!token) return o.status(400).end('No token');
    if(!query) return o.status(400).end('No query');

    let user = GetUserByToken(token);
    if(!user) return o.status(400).end('Invalid token');

    query = query.toLowerCase();1

    let results = Users.all()
        .map(r => Users.get(r.ID))
        .filter(u =>
            u.id.toLowerCase().indexOf(query) > -1 ||
            u.username.toLowerCase().indexOf(query) > -1 ||
            u.handle.toLowerCase().indexOf(query) > -1
        )
        .map(r => new User(r).scrub());

    return o.json(results);

}