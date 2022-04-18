import User from "./User";
declare type Response = Promise<{
    [key: string]: any;
}>;
export declare type Method = 'post' | 'get' | 'put' | 'delete' | 'patch';
export default class RestObject {
    readonly endpoint: string;
    readonly authorized: Method[];
    constructor(endpoint: string, authorized: Method[]);
    post(user: User | undefined, data: any): Response;
    get(user: User | undefined, data: any): Response;
    put(user: User | undefined, data: any): Response;
    delete(user: User | undefined, data: any): Response;
    patch(user: User | undefined, data: any): Response;
}
export {};
