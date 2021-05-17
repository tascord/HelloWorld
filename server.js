/* Pre-Requisites */
const { User, GetUserById, GenerateToken } = require('./server/api/User');
const { readdirSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

/* Server setup */
const app = require('express')();
app.listen(3001, () => console.log('Started Server'));

/* Incoming requests */
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));

/* Uploading files */
if(!existsSync(join(__dirname, 'server', 'media'))) mkdirSync(join(__dirname, 'server', 'media'));
const multipart = require('connect-multiparty')({ uploadDir: join(__dirname, 'server', 'media'), maxFilesSize: 2400000, autoFiles: true });

/* CORS */
const cors = require('cors');
app.use(cors());

/* API Routes */
const routes = {};
readdirSync(join(__dirname, 'server', 'api', 'routes')).forEach(file => {
    routes[file.slice(0, -3).toLowerCase()] = require(join(__dirname, 'server', 'api', 'routes', file));
})

/* Redirect GET Requests */
app.get('*', (req, res) => {
    res.redirect('http://localhost:3000');
});

/* Handle POST Requests */
app.post('*', multipart, (req, res) => {
    
    let path = req.path.slice(1) || 'index';

    console.log(`[/${path}] ${JSON.stringify(req.body)}`);

    if(routes[path]) routes[path](req, res);
    else res.status(404).end();

})

/* Create System Account If Non-Existent */
if(!GetUserById('system')) {

    new User({
        username: 'System',
        id: 'system',
        handle: 'System',
        avatar: "/system.png",
        auth: 'd:2398201980593809809248309',
        token: GenerateToken() ,
        flags: [ User.FLAGS.SYSTEM ]
    }).save();

}

