/* Pre-Requisites */
const { User, GetUserById, GenerateToken } = require('./server/api/User');
const { readdirSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const { grey, cyanBright, redBright, whiteBright, greenBright } = require('chalk');

/* Server setup */
const app = require('express')();
let locations = {};

/* Incoming requests */
app.use(require('body-parser').json());

/* WebRTC */


/* Incoming Files */
if (!existsSync(join(__dirname, 'server', 'media'))) require('fs').mkdirSync(join(__dirname, 'server', 'media'));
const multiparty = require('connect-multiparty')({ uploadDir: join(__dirname, 'server', 'media'), maxFilesSize: 2400000, autoFiles: true });

/* CORS */
const cors = require('cors');
const { getImageById } = require('./server/api/Image');
app.use(cors());

/* API Routes */
const routes = {};
readdirSync(join(__dirname, 'server', 'api', 'routes')).forEach(file => {
    routes[file.slice(0, -3).toLowerCase()] = require(join(__dirname, 'server', 'api', 'routes', file));
})

/* Redirect GET Requests */
app.get('*', (req, res) => {

    if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', 'public, max-age=36000');

    if (req.path === '/image') {

        if (!req.query.id) {
            console.log(grey('(') + cyanBright('API') + grey(') ') + redBright('GET ') + whiteBright(req.path + ' ') + grey('No image ID provided'));
            return res.status(400).end('No image ID provided');
        }

        let image = getImageById(req.query.id);

        if (!image) {
            console.log(grey('(') + cyanBright('API') + grey(') ') + redBright('GET ') + whiteBright(req.path + ' ') + grey('Invalid image ID'));
            return res.status(400).end('Invalid image ID');
        }

        const img = Buffer.from(!req.query.low ? image.high.data : image.low.data, 'base64');

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });

        res.end(img);

        console.log(grey('(') + cyanBright('API') + grey(') ') + greenBright('GET ') + whiteBright(req.path + ' '));
    }

    else return res.redirect(locations.site);

});

/* Handle POST Requests */
app.post('*', multiparty, (req, res) => {

    let path = req.path.slice(1) || 'index';
    req.locations = locations;

    if (routes[path]) {
        routes[path](req, res);
        console.log(grey('(') + cyanBright('API') + grey(') ') + greenBright('POST ') + whiteBright(req.path + ' ') + grey('Endpoint exists'));
    }

    else {
        res.status(404).end();
        console.log(grey('(') + cyanBright('API') + grey(') ') + redBright('POST ') + whiteBright(req.path + ' '));
    }

})

/* Create System Account If Non-Existent */
if (!GetUserById('system')) {

    new User({
        username: 'System',
        id: 'system',
        handle: 'System',
        avatar: "/system.png",
        auth: 'd:2398201980593809809248309',
        token: GenerateToken(),
        flags: [User.FLAGS.SYSTEM]
    }).save();

}


module.exports = (port, new_locations) => {
    locations = new_locations;
    app.listen(port, () => console.log(grey('(') + cyanBright('BRC') + grey(') ') + greenBright('API started @ ') + cyanBright(locations.api) + grey(` [${port}]`)));
}