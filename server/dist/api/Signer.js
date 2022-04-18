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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var fs_1 = require("fs");
var path_1 = require("path");
var crypto_1 = require("crypto");
var key_base = (0, path_1.join)(__dirname, "../../keys");
if (!(0, fs_1.existsSync)((0, path_1.join)(key_base, 'private.key'))) {
    var _a = (0, crypto_1.generateKeyPairSync)("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
        }
    }), privateKey = _a.privateKey, publicKey = _a.publicKey;
    (0, fs_1.writeFileSync)((0, path_1.join)(key_base, 'private.key'), privateKey);
    (0, fs_1.writeFileSync)((0, path_1.join)(key_base, 'public.key'), publicKey);
}
var keys = {
    privateKey: (0, fs_1.readFileSync)((0, path_1.join)(key_base, 'private.key')),
    publicKey: (0, fs_1.readFileSync)((0, path_1.join)(key_base, 'public.key'))
};
/** ------------------------------- **/
var ALGO = 'HS256';
exports.default = {
    /**
     * Signs the given payload
     * @param payload Data to sign
     * @param options JWT options
     * @returns Signed data
     */
    sign: function (payload, options) {
        if (options === void 0) { options = {}; }
        return jsonwebtoken_1.default.sign(payload, keys.privateKey, __assign({ algorithm: ALGO }, options));
    },
    /**
     * Verifies a given JWT
     * @param token JWT to verify
     * @returns Decoded JWT
     */
    verify: function (token) {
        var data = {};
        try {
            data = jsonwebtoken_1.default.verify(token, keys.publicKey, {
                algorithms: [ALGO]
            });
        }
        catch (_a) { }
        return data;
    },
    /**
     * Decodes a given JWT
     * @param token JWT to decode
     * @returns Decoded data
     */
    decode: function (token) {
        return jsonwebtoken_1.default.decode(token, { complete: true });
    }
};
//# sourceMappingURL=Signer.js.map