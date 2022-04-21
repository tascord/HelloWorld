import User from "./User";
declare type Response = Promise<{
    [key: string]: any;
}>;
export declare type Method = 'post' | 'get' | 'put' | 'delete' | 'patch';
export default class RestObject {
    readonly endpoint: string;
    readonly authorized: Method[];
    constructor(endpoint: string, authorized: Method[]);
    post(user: User | undefined, data: any, params: {
        [key: string]: string;
    }): Response;
    get(user: User | undefined, data: any, params: {
        [key: string]: string;
    }): Response;
    put(user: User | undefined, data: any, params: {
        [key: string]: string;
    }): Response;
    delete(user: User | undefined, data: any, params: {
        [key: string]: string;
    }): Response;
    patch(user: User | undefined, data: any, params: {
        [key: string]: string;
    }): Response;
}
export {};
