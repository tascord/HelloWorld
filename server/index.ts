import express, { Request, Response } from "express";
import cors from "cors";
import { json } from "body-parser";
import { readdirSync } from "fs";
import { join } from "path";
import RestObject, { Method } from "./api/Object";
import { Logger } from "./api/Logger";
import User from "./api/User";

console.clear();
const app = express();
app.listen(4000, () => {
    Logger.info("Server started on port 4000", '🚀');
})

app.use(cors());
app.use(json());

// Load REST routes
readdirSync(join(__dirname, 'api/rest'))
    .filter(file => file.endsWith('.js'))
    .forEach(file => {

        const route = require(join(__dirname, 'api/rest', file)).Object as RestObject;

        Logger.info(`[REST] Loading endpoint /${route.endpoint}`, '🔗');
        const handle = (method: Method, i: Request, o: Response) => {

            Logger.info(`[REST : HIT] ${method} /${route.endpoint}`, '🧭');

            try {

                let user;
                if (i.headers.authorization) {
                    user = User.from_token(i.headers.authorization);
                }

                if (!user && route.authorized.includes(method)) return o.status(401).end({ error: 'Unauthorized' });
                route[method](user, i.body)
                    .then(data => o.json(data))
                    .catch(e => o.status(e.status ?? 400).end(e.message ?? e))

            }

            catch (e: any) {
                o.status(e.status ?? 400).end(e.message ?? e);
            }

            finally {
                Logger.info(`[REST : ${o.statusCode}] ${method} /${route.endpoint}`, '🧭');
            }
        }

        app.get(`/${route.endpoint}`, (i, o) => handle('get', i, o));
        app.post(`/${route.endpoint}`, (i, o) => handle('post', i, o));
        app.put(`/${route.endpoint}`, (i, o) => handle('put', i, o));
        app.delete(`/${route.endpoint}`, (i, o) => handle('delete', i, o));
        app.patch(`/${route.endpoint}`, (i, o) => handle('patch', i, o));

    });