const base = (require('quick.db')(require('path').join(__dirname, '../', '../', '../', 'bedroom.sqlite')));

export const databases = {

    users: new base.table('users'),
    profiles: new base.table('profiles'),
    posts: new base.table('posts'),
    images: new base.table('images'),

}