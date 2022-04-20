"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = require("body-parser");
var fs_1 = require("fs");
var path_1 = require("path");
var Logger_1 = require("./api/Logger");
var User_1 = __importDefault(require("./api/User"));
console.clear();
var app = (0, express_1.default)();
app.listen(4000, function () {
    Logger_1.Logger.info("Server started on port 4000", '🚀');
});
app.use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
// Load REST routes
(0, fs_1.readdirSync)((0, path_1.join)(__dirname, 'api/rest'))
    .filter(function (file) { return file.endsWith('.js'); })
    .forEach(function (file) {
    var route = require((0, path_1.join)(__dirname, 'api/rest', file)).Object;
    Logger_1.Logger.info("[REST] Loading endpoint /".concat(route.endpoint), '🔗');
    var handle = function (method, i, o) {
        var _a, _b;
        Logger_1.Logger.info("[REST : HIT] ".concat(method, " /").concat(route.endpoint), '🧭');
        try {
            var user = void 0;
            if (i.headers.authorization) {
                user = User_1.default.from_token(i.headers.authorization);
            }
            if (!user && route.authorized.includes(method))
                return o.status(401).end({ error: 'Unauthorized' });
            route[method](user, i.body)
                .then(function (data) { return o.json(data); })
                .catch(function (e) { var _a, _b; return o.status((_a = e.status) !== null && _a !== void 0 ? _a : 400).end((_b = e.message) !== null && _b !== void 0 ? _b : e); });
        }
        catch (e) {
            o.status((_a = e.status) !== null && _a !== void 0 ? _a : 400).end((_b = e.message) !== null && _b !== void 0 ? _b : e);
        }
        finally {
            Logger_1.Logger.info("[REST : ".concat(o.statusCode, "] ").concat(method, " /").concat(route.endpoint), '🧭');
        }
    };
    app.get("/".concat(route.endpoint), function (i, o) { return handle('get', i, o); });
    app.post("/".concat(route.endpoint), function (i, o) { return handle('post', i, o); });
    app.put("/".concat(route.endpoint), function (i, o) { return handle('put', i, o); });
    app.delete("/".concat(route.endpoint), function (i, o) { return handle('delete', i, o); });
    app.patch("/".concat(route.endpoint), function (i, o) { return handle('patch', i, o); });
});
//# sourceMappingURL=index.js.map