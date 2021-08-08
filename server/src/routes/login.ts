import Route from "../classes/Route";
import { Request, Response } from "express";
import User from "../classes/User";

let route: Route;
module.exports = route = new Route({
    authorized: false,
    path: "login",
});

route.run = (req: Request, res: Response) => {

    const { username, password } = req.body;

    if (!username) return res.json(route.response(true, "No username provided"));
    if (!password) return res.json(route.response(true, "No password provided"));

    User.login_user(username, password)
        .then((user: User) => res.json(route.response(false, undefined, user.safe(true))))
        .catch((error: string) => res.status(400).json(route.response(true, error)));

};