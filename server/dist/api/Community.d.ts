import Message from "./Message";
import { Action } from "./Permissions";
import User from "./User";
export declare type Audit = {
    action: Action;
    initiator_id: string;
    target_id?: string;
};
export default class Community {
    readonly id: string;
    private _name;
    private _description;
    private _owner_id;
    private _created;
    private _users;
    private _messages;
    private _audit_log;
    constructor(data: {
        [key: string]: any;
    });
    static from_id(id: string): Community;
    static for_user(user: User): Community;
    to_public(user?: User): {
        id: string;
        name: string;
        description: string;
        owner_id: string;
        created: Date;
        users: string[];
        messages: string[];
        audit_log: Audit[];
    };
    save(): void;
    private static generate_id;
    static create(user: User, name: string, description: string): Community;
    private post_audit;
    get name(): string;
    get description(): string;
    get owner_id(): string;
    get created(): Date;
    get users(): User[];
    get messages(): Message[];
    get audit_log(): Audit[];
    rename(user: User, name: string): void;
    set_description(user: User, description: string): void;
    transfer_ownership(user: User, new_owner: User): void;
}
