import Route from "../classes/Route";
import { Request, Response } from "express";
import User from "../classes/User";

let route: Route;
module.exports = route = new Route({
    authorized: true,
    path: "self",
});

route.run = (req: Request, res: Response, user: User) => {

    res.json(route.response(false, undefined, user.get_profile_data()));

};