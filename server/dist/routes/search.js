"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Route_1 = __importDefault(require("../classes/Route"));
var User_1 = __importDefault(require("../classes/User"));
var route;
module.exports = route = new Route_1.default({
    authorized: false,
    path: "search",
});
route.run = function (req, res) {
    var query = req.body.query;
    if (!query) {
        return res.status(400).json(route.response(true, "No query provided"));
    }
    res.json(route.response(false, undefined, {
        users: User_1.default.search_users(query)
            .map(function (user) { return user.get_profile_data(); })
    }));
};
//# sourceMappingURL=search.js.map