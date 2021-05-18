const { User, GetUserByToken, GetUserByHandle } = require('../User');
const { Image } = require('../Image');

module.exports = function GetSelf(i, o) {

    let { token, username, handle } = i.body;
    let { avatar } = i.files;

    if(!token) return o.status(400).end('No token');
    
    let user = GetUserByToken(token);
    if(!user) return o.status(400).end('Invalid token');
    user = new User(user);

    let handle_user = GetUserByHandle(handle);    
    if(handle_user ? handle_user.id !== user.id : false) return o.status(409).end('A user already exists with that handle');
    
    // No username check because they aren't unique

    user.username = username || user.username;
    user.handle = handle || user.handle;

    if(avatar) {
        user.avatar = Image.upload(
            avatar.originalFileName,
            avatar.path
        )
    }

    if(!/^.{0,20}$/.test(user.username)) return o.status(400).end('Invalid username');
    if(!/^[A-z0-9_.]{0,15}$/.test(user.handle)) return o.status(400).end('Invalid handle');

    user.save();
    o.redirect(`http://localhost:3000/profile/${user.handle}`);

}