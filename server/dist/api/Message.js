"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Data_1 = require("../api/Data");
var User_1 = __importDefault(require("./User"));
var Message = /** @class */ (function () {
    function Message(data) {
        var _a;
        this.id = data.id;
        this._content = data.content;
        this.created = new Date(data.created);
        this.author_id = data.author_id;
        this._edits = (_a = data.edits) !== null && _a !== void 0 ? _a : [];
        if (!this.id)
            throw new Error('Message must have an ID');
        if (!this._content)
            throw new Error('Message must have content');
        if (!this.created)
            throw new Error('Message must have a creation date');
        if (!this.author_id)
            throw new Error('Message must have an author');
    }
    /* ------------------------------------------------- */
    Message.from_id = function (id) {
        if (!Data_1.Tables.Messages.has(id))
            throw new Error("Message with id '".concat(id, "' does not exist"));
        return new Message(Data_1.Tables.Messages.get(id));
    };
    /* ------------------------------------------------- */
    Message.prototype.to_public = function () {
        return {
            id: this.id,
            content: this.content,
            created: this.created.getTime(),
            author_id: this.author_id,
            edits: this.edits
        };
    };
    Message.prototype.delete = function () {
        var _this = this;
        Data_1.Tables.Messages.delete(this.id);
        var author = User_1.default.from_id(this.author_id);
        author.messages = author.messages.filter(function (m) { return m.id !== _this.id; });
    };
    /* ------------------------------------------------- */
    Message.create = function (content, community, author) {
        var id;
        do {
            id = Date.now().toString();
        } while (Data_1.Tables.Messages.has(id));
        if (content.length < 5)
            throw new Error('Message must be at least 5 characters long');
        if (content.length > 1000)
            throw new Error('Message must be less than 1000 characters long');
        // Normalize string
        content = content.normalize();
        content = content.replace(/\s+/g, ' ');
        content = content.trim();
        // TODO: More checks
        Data_1.Tables.Messages.set(id, {
            id: id,
            content: content,
            created: Date.now(),
            author_id: author
        });
        author.messages.push(new Message({
            id: id,
            content: content,
            created: Date.now(),
            author_id: author.id
        }));
        author.save();
        return this.from_id(id);
    };
    Object.defineProperty(Message.prototype, "content", {
        /* ------------------------------------------------- */
        get: function () { return this._content; },
        set: function (content) {
            if (content.length < 5)
                throw new Error('Message must be at least 5 characters long');
            if (content.length > 1000)
                throw new Error('Message must be less than 1000 characters long');
            // Normalize string
            content = content.normalize();
            content = content.replace(/\s+/g, ' ');
            content = content.trim();
            // TODO: don't reuse
            this.edits.push(this.content);
            this._content = content;
            Data_1.Tables.Messages.set(this.id, {
                id: this.id,
                content: content,
                created: Date.now(),
                author_id: this.author_id
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "edits", {
        get: function () { return this._edits; },
        enumerable: false,
        configurable: true
    });
    return Message;
}());
exports.default = Message;
//# sourceMappingURL=Message.js.map