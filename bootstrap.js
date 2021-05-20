// Filesystem
const { existsSync } = require('fs');
const { join } = require('path');
const { grey, cyanBright, redBright, whiteBright, greenBright } = require('chalk');

// Constants
let locations = {

    api: 'http://localhost:3001',
    site: 'http://localhost:3000',

}

// Start the API
const start_api = (port) => {

    // Start the API
    require('./server')(port, locations);

}

// Start the react server
const start_brc = (port) => {

    if(!existsSync(join(__dirname, 'build'))) return console.log(grey('(') + cyanBright('BRC') + grey(') ') + greenBright('BRC started via react-scripts'));

    const app = require('express')();
    app.listen(port, () => console.log(grey('(') + cyanBright('BRC') + grey(') ') + greenBright('BRC started @ ') + cyanBright(locations.site) + grey(` [${port}]`)));
    app.use(require('body-parser').json());

    app.get('*', (req, res) => {

        if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', 'public, max-age=259200');

        if (req.path.indexOf('.') == -1) res.sendFile(join(__dirname, 'build', 'index.html'))
        else {

            let local_path = join(__dirname, 'build', req.path);
            if (existsSync(local_path)) res.sendFile(local_path);
            else {

                console.log(grey('(') + cyanBright('BRC') + grey(') ') + redBright('GET ') + whiteBright(req.path));
                return res.status(404).end();

            }

            console.log(grey('(') + cyanBright('BRC') + grey(') ') + greenBright('GET ') + whiteBright(req.path + ' ') + grey(local_path));

        }

    });

    app.post('/update', (req, res) => {
        console.log(grey('(') + cyanBright('BRC') + grey(') ') + greenBright('Update request ') + whiteBright(req.path + ' '));
        console.log('body', req.body);
        res.status(204).end();
    })

}

// Port assignment
if (!existsSync('/opt/DeployManager')) {

    // Localhost
    start_api(3001);
    start_brc(3000);

}

else {

    locations = {

        site: 'https://bedroom.community',
        api: 'https://api.bedroom.community'

    }

    const { HTTPS, WebImplementation } = require('/opt/DeployManager/src/lib');
    
    const brc = new WebImplementation(
        'BRC-SRV', // Name
        new HTTPS('/etc/letsencrypt/live/bedroom.community/fullchain.pem', '/etc/letsencrypt/live/bedroom.community/privkey.pem', true), // Protocol
        'bedroom.community', // External URL
        true, // Force creation
    );

    const api = new WebImplementation(
        'BRC-API', // Name
        new HTTPS('/etc/letsencrypt/live/api.bedroom.community/fullchain.pem', '/etc/letsencrypt/live/api.bedroom.community/privkey.pem', true), // Protocol
        'api.bedroom.community', // External URL
        true, // Force creation
    );

    brc.on('ready', () => start_brc(brc.port));
    api.on('ready', () => start_api(api.port));


}