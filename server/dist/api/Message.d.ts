import Community from "./Community";
import User from "./User";
export default class Message {
    readonly id: string;
    readonly content: string;
    readonly created: Date;
    readonly author_id: string;
    constructor(data: {
        [key: string]: any;
    });
    static from_id(id: string): Message;
    static create(content: string, community: Community, author: User): void;
}
