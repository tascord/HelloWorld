import Route from "../classes/Route";
import { Request, Response } from "express";

let route: Route;
module.exports = route = new Route({
    authorized: false,
    path: "ping",
});

route.run = (req: Request, res: Response) => {

    res.json(route.response(false, 'Pong!'));

};