"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RestObject = /** @class */ (function () {
    function RestObject(endpoint, authorized) {
        this.endpoint = endpoint;
        this.authorized = authorized;
    }
    RestObject.prototype.post = function (user, data, params) { return Promise.reject("No POST method exists for /".concat(this.endpoint)); };
    RestObject.prototype.get = function (user, data, params) { return Promise.reject("No GET method exists for /".concat(this.endpoint)); };
    RestObject.prototype.put = function (user, data, params) { return Promise.reject("No PUT method exists for /".concat(this.endpoint)); };
    RestObject.prototype.delete = function (user, data, params) { return Promise.reject("No DELETE method exists for /".concat(this.endpoint)); };
    RestObject.prototype.patch = function (user, data, params) { return Promise.reject("No PATCH method exists for /".concat(this.endpoint)); };
    return RestObject;
}());
exports.default = RestObject;
//# sourceMappingURL=Object.js.map