import Hasty from "hasty.db";
import { join } from "path";

const DB = new Hasty(join(__dirname, '../brc.db'));
export const Tables = {
    Users: DB.Table('users'),
    Username_ID_Map: DB.Table('username_id_map'),

    Messages: DB.Table('messages'),
    Communities: DB.Table('communities'),
}