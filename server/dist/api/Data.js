"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tables = void 0;
var hasty_db_1 = __importDefault(require("hasty.db"));
var path_1 = require("path");
var TableNames = [
    'Users', 'Username_ID_Map', 'Messages', 'Communities'
];
var DB = new hasty_db_1.default((0, path_1.join)(__dirname, '../brc.db'));
exports.Tables = {
    Users: DB.Table('users'),
    Username_ID_Map: DB.Table('username_id_map'),
    Messages: DB.Table('messages'),
    Communities: DB.Table('communities'),
};
//# sourceMappingURL=Data.js.map