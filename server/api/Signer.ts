import JWT from "jsonwebtoken";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join as pathJoin } from "path";
import { generateKeyPairSync } from "crypto";

const key_base = pathJoin(__dirname, "../../keys");

if (!existsSync(pathJoin(key_base, 'private.key'))) {

    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
        }
    });

    writeFileSync(pathJoin(key_base, 'private.key'), privateKey);
    writeFileSync(pathJoin(key_base, 'public.key'), publicKey);

}

const keys = {
    privateKey: readFileSync(pathJoin(key_base, 'private.key')),
    publicKey: readFileSync(pathJoin(key_base, 'public.key'))
}

/** ------------------------------- **/

const ALGO = 'HS256';
export default {

    /**
     * Signs the given payload
     * @param payload Data to sign
     * @param options JWT options
     * @returns Signed data
     */
    sign: function (payload: { [key: string]: any }, options: { [key: string]: any } = {}) {
        return JWT.sign(payload, keys.privateKey, {
            algorithm: ALGO,
            ...options
        })
    },

    /**
     * Verifies a given JWT
     * @param token JWT to verify
     * @returns Decoded JWT
     */
    verify: function (token: string) {
        let data = {};
        try {
            data = JWT.verify(token, keys.publicKey, {
                algorithms: [ALGO]
            });
        } catch {}

        return data;
    },

    /**
     * Decodes a given JWT
     * @param token JWT to decode
     * @returns Decoded data
     */
    decode: function (token: string) {
        return JWT.decode(token, { complete: true });
    }

}