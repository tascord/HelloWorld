import Route from "../classes/Route";
import { Request, Response } from "express";
import User from "../classes/User";

let route: Route;
module.exports = route = new Route({
    authorized: false,
    path: "search",
});

route.run = (req: Request, res: Response) => {

    const query: string = req.body.query;
    if (!query) {
        return res.status(400).json(route.response(true, "No query provided"));
    }

    res.json(route.response(false, undefined, {
        users:
            User.search_users(query)
                .map(user => user.get_profile_data())
    }));

};