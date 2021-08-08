"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databases = void 0;
var base = (require('quick.db')(require('path').join(__dirname, '../', '../', '../', 'bedroom.sqlite')));
exports.databases = {
    users: new base.table('users'),
    profiles: new base.table('profiles'),
    posts: new base.table('posts'),
    images: new base.table('images'),
};
//# sourceMappingURL=data.js.map