"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data_1 = require("../api/Data");
var Message = /** @class */ (function () {
    function Message(data) {
        this.id = data.id;
        this.content = data.content;
        this.created = new Date(data.created);
        this.author_id = data.author_id;
        if (!this.id)
            throw new Error('Message must have an ID');
        if (!this.content)
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
    };
    return Message;
}());
exports.default = Message;
//# sourceMappingURL=Message.js.map