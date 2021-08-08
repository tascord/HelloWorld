import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { readdirSync } from "fs";
import { join } from "path";
import Route from "./classes/Route";
import User from "./classes/User";

// Create server
const app = express();
app.listen(3001);

// Get JSON data from body
app.use(bodyParser.json());

// CORS
app.use(cors());

// Import routes
const routes: Route[] = [];
const route_base_path = join(__dirname, 'routes/');
for (const route_path of readdirSync(route_base_path).filter(file_path => file_path.endsWith('js'))) {
    routes.push(require(join(route_base_path, route_path)));
}

// Redirect GET requests to react site
app.get('*', (_, o) => {

    return o.redirect('http://localhost:3000');

});

// Routing POST requests
app.post('*', (req, res) => {

    const path = req.path.slice(1) || 'ping';
    const route: Route | undefined = routes.find(route => route.path === path);

    if (!route) return res.status(404).end();
    if (route.authorized) {
        
        // Check for authorization header
        if(!req.headers.authorization) return res.status(401).json(route.response(true, 'Route requires authorization'));
        
        // Extract session token
        let session_token = req.headers.authorization.slice(7);
        const user = User.get_user_by_session_token(session_token);
        
        // If no user found, return error
        if(!(user instanceof User)) return res.status(401).json(route.response(true, 'Invalid authorization provided'));
        
        // Run route with user
        return route.run(req, res, user);

    }

    route.run(req, res);

});
