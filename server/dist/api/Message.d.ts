import Community from "./Community";
import User from "./User";
export default class Message {
    readonly id: string;
    readonly title: string;
    private _content;
    readonly created: Date;
    readonly author_id: string;
    readonly community_id: string;
    private _edits;
    constructor(data: {
        [key: string]: any;
    });
    static from_id(id: string): Message;
    to_public(): {
        id: string;
        title: string;
        content: string;
        created: number;
        author_id: string;
        community_id: string;
        edits: string[];
    };
    delete(): void;
    static create(title: string, content: string, community: Community, author: User): Message;
    get content(): string;
    get edits(): string[];
    set content(content: string);
}
