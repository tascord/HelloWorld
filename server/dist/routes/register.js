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
    path: "register",
});
route.run = function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password, email = _a.email;
    if (!username)
        return res.json(route.response(true, "No username provided"));
    if (!password)
        return res.json(route.response(true, "No password provided"));
    if (!email)
        return res.json(route.response(true, "No email provided"));
    User_1.default.register_user(username, password, email)
        .then(function (user) { return res.json(route.response(false, undefined, user.safe(true))); })
        .catch(function (error) { return res.status(400).json(route.response(true, error)); });
};
//# sourceMappingURL=register.js.map