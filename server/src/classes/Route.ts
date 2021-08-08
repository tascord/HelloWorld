import User from "./User";
import { Request, Response } from "express";

type RouteOpts = {

    path: string
    authorized: boolean

}

export default class Route {

    path: string;
    authorized: boolean;

    constructor(opts: RouteOpts) {

        this.path = opts.path;
        this.authorized = opts.authorized;

    }

    response(error: boolean, message?: string, data?: Object): Object {

        const response: any = { ...data };

        response.success = !error;
        if (message) response.message = message;

        return response;

    }

    run(req: Request, res: Response, user?: User) {

        res.json(this.response(true, "Not Implemented"));

    }

}