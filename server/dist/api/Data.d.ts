import { Hastyable } from "hasty.db";
declare const TableNames: readonly ["Users", "Username_ID_Map", "Messages", "Communities"];
export declare const Tables: {
    [key in typeof TableNames[number]]: Hastyable;
};
export declare function generate_id(): string;
export {};
