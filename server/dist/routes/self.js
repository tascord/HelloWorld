"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Route_1 = __importDefault(require("../classes/Route"));
var route;
module.exports = route = new Route_1.default({
    authorized: true,
    path: "self",
});
route.run = function (req, res, user) {
    res.json(route.response(false, undefined, user.get_profile_data()));
};
//# sourceMappingURL=self.js.map