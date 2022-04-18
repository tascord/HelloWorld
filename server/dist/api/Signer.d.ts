import JWT from "jsonwebtoken";
declare const _default: {
    /**
     * Signs the given payload
     * @param payload Data to sign
     * @param options JWT options
     * @returns Signed data
     */
    sign: (payload: {
        [key: string]: any;
    }, options?: {
        [key: string]: any;
    }) => string;
    /**
     * Verifies a given JWT
     * @param token JWT to verify
     * @returns Decoded JWT
     */
    verify: (token: string) => {};
    /**
     * Decodes a given JWT
     * @param token JWT to decode
     * @returns Decoded data
     */
    decode: (token: string) => JWT.Jwt | null;
};
export default _default;
