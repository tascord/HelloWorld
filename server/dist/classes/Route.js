"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Route = /** @class */ (function () {
    function Route(opts) {
        this.path = opts.path;
        this.authorized = opts.authorized;
    }
    Route.prototype.response = function (error, message, data) {
        var response = __assign({}, data);
        response.success = !error;
        if (message)
            response.message = message;
        return response;
    };
    Route.prototype.run = function (req, res, user) {
        res.json(this.response(true, "Not Implemented"));
    };
    return Route;
}());
exports.default = Route;
//# sourceMappingURL=Route.js.map