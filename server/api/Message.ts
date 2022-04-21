import Community from "./Community";
import { Tables } from "../api/Data";
import User from "./User";

export default class Message {
    readonly id: string;
    private _content: string;
    readonly created: Date;
    readonly author_id: string;
    private _edits: string[];

    constructor(data: { [key: string]: any }) {
        this.id = data.id;
        this._content = data.content;
        this.created = new Date(data.created);
        this.author_id = data.author_id;
        this._edits = data.edits ?? [];

        if (!this.id) throw new Error('Message must have an ID');
        if (!this._content) throw new Error('Message must have content');
        if (!this.created) throw new Error('Message must have a creation date');
        if (!this.author_id) throw new Error('Message must have an author');
    }

    /* ------------------------------------------------- */

    static from_id(id: string) {
        if (!Tables.Messages.has(id)) throw new Error(`Message with id '${id}' does not exist`);
        return new Message(Tables.Messages.get(id));
    }

    /* ------------------------------------------------- */

    to_public() {
        return {
            id: this.id,
            content: this.content,
            created: this.created.getTime(),
            author_id: this.author_id,
            edits: this.edits
        }
    }

    delete() {
        Tables.Messages.delete(this.id);
        const author = User.from_id(this.author_id);
        author.messages = author.messages.filter(m => m.id !== this.id);
    }

    /* ------------------------------------------------- */

    static create(content: string, community: Community, author: User) {

        let id;
        do { id = Date.now().toString() }
        while (Tables.Messages.has(id));

        if (content.length < 5) throw new Error('Message must be at least 5 characters long');
        if (content.length > 1000) throw new Error('Message must be less than 1000 characters long');

        // Normalize string
        content = content.normalize();
        content = content.replace(/\s+/g, ' ');
        content = content.trim();

        // TODO: More checks

        Tables.Messages.set(id, {
            id,
            content,
            created: Date.now(),
            author_id: author
        });

        author.messages.push(
            new Message({
                id,
                content,
                created: Date.now(),
                author_id: author.id
            })
        );

        author.save();
        return this.from_id(id);

    }

    /* ------------------------------------------------- */

    get content() { return this._content; }
    get edits() { return this._edits; }

    set content(content: string) {
        if (content.length < 5) throw new Error('Message must be at least 5 characters long');
        if (content.length > 1000) throw new Error('Message must be less than 1000 characters long');

        // Normalize string
        content = content.normalize();
        content = content.replace(/\s+/g, ' ');
        content = content.trim();

        // TODO: don't reuse

        this.edits.push(this.content);
        this._content = content;

        Tables.Messages.set(this.id, {
            id: this.id,
            content,
            created: Date.now(),
            author_id: this.author_id
        });


    }



}