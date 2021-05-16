const { GetUserByToken, User } = require('../User');
const Table = require('../Data');
const Posts = Table('Posts');

module.exports = function Search(i, o) {

    let { token, content } = i.body;
    if(!token) return o.status(400).end('No token');

    return o.json(results);

}