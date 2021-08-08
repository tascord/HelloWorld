"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var e_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var fs_1 = require("fs");
var path_1 = require("path");
var User_1 = __importDefault(require("./classes/User"));
// Create server
var app = express_1.default();
app.listen(3001);
// Get JSON data from body
app.use(body_parser_1.default.json());
// CORS
app.use(cors_1.default());
// Import routes
var routes = [];
var route_base_path = path_1.join(__dirname, 'routes/');
try {
    for (var _b = __values(fs_1.readdirSync(route_base_path).filter(function (file_path) { return file_path.endsWith('js'); })), _c = _b.next(); !_c.done; _c = _b.next()) {
        var route_path = _c.value;
        routes.push(require(path_1.join(route_base_path, route_path)));
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    }
    finally { if (e_1) throw e_1.error; }
}
// Redirect GET requests to react site
app.get('*', function (_, o) {
    return o.redirect('http://localhost:3000');
});
// Routing POST requests
app.post('*', function (req, res) {
    var path = req.path.slice(1) || 'ping';
    var route = routes.find(function (route) { return route.path === path; });
    if (!route)
        return res.status(404).end();
    if (route.authorized) {
        // Check for authorization header
        if (!req.headers.authorization)
            return res.status(401).json(route.response(true, 'Route requires authorization'));
        // Extract session token
        var session_token = req.headers.authorization.slice(7);
        var user = User_1.default.get_user_by_session_token(session_token);
        // If no user found, return error
        if (!(user instanceof User_1.default))
            return res.status(401).json(route.response(true, 'Invalid authorization provided'));
        // Run route with user
        return route.run(req, res, user);
    }
    route.run(req, res);
});
//# sourceMappingURL=index.js.map