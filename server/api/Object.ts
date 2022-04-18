import User from "./User";

type Response = Promise<{ [key: string]: any }>;
export type Method = 'post' | 'get' | 'put' | 'delete' | 'patch';

export default class RestObject {

    readonly endpoint: string;
    readonly authorized: Method[];

    constructor(endpoint: string, authorized: Method[]) {
        this.endpoint = endpoint;
        this.authorized = authorized;
    }

    post(user: User | undefined, data: any): Response { return Promise.reject(`No POST method exists for /${this.endpoint}`) }
    get(user: User | undefined, data: any): Response { return Promise.reject(`No GET method exists for /${this.endpoint}`) }
    put(user: User | undefined, data: any): Response { return Promise.reject(`No PUT method exists for /${this.endpoint}`) }
    delete(user: User | undefined, data: any): Response { return Promise.reject(`No DELETE method exists for /${this.endpoint}`) }
    patch(user: User | undefined, data: any): Response { return Promise.reject(`No PATCH method exists for /${this.endpoint}`) }

}