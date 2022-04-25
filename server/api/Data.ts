import Hasty, { Hastyable } from "hasty.db";
import { join } from "path";

const TableNames = [
    'Users', 'Username_ID_Map', 'Messages', 'Communities'
] as const;

const DB = new Hasty(join(__dirname, '../../brc.db'));
export const Tables: { [key in typeof TableNames[number]]: Hastyable } = {
    Users: DB.Table('users'),
    Username_ID_Map: DB.Table('username_id_map'),

    Messages: DB.Table('messages'),
    Communities: DB.Table('communities'),
}

export function generate_id() {
    let id: string;
    do { id = Date.now().toString(); }
    while (Tables.Users.has(id) || Tables.Messages.has(id) || Tables.Communities.has(id));
    return id;
}