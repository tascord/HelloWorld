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
    path: "profile",
});
route.run = function (req, res) {
    // Username or ID
    var identifier = req.body.identifier;
    if (!identifier) {
        return res.status(400).json(route.response(true, "No identifier provided"));
    }
    var user = User_1.default.get_user_by_id(identifier) || User_1.default.get_user_by_handle(identifier);
    if (!(user instanceof User_1.default))
        return res.status(400).json(route.response(true, "No user with that handle or id"));
    res.json(route.response(false, undefined, user.get_profile_data()));
};
//# sourceMappingURL=profile.js.map