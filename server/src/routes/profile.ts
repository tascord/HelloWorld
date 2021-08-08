import Route from "../classes/Route";
import { Request, Response } from "express";
import User from "../classes/User";

let route: Route;
module.exports = route = new Route({
    authorized: false,
    path: "profile",
});

route.run = (req: Request, res: Response) => {

    // Username or ID
    const identifier: string = req.body.identifier;
    if(!identifier) {
        return res.status(400).json(route.response(true, "No identifier provided"));
    }

    const user = User.get_user_by_id(identifier) || User.get_user_by_handle(identifier);
    if(!(user instanceof User)) return res.status(400).json(route.response(true, "No user with that handle or id")); 
    res.json(route.response(false, undefined, user.get_profile_data()));

};