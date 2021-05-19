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

    const app = require('express')();
    app.listen(port, () => console.log(grey('(') + cyanBright('BRC') + grey(') ') + greenBright('BRC started @ ') + cyanBright(locations.site) + grey(` [${port}]`)));

    app.get('*', (req, res) => {

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
        'tsib', // Name
        new HTTPS('/etc/letsencrypt/live/bedroom.community/fullchain.pem', '/etc/letsencrypt/live/bedroom.community/privkey.pem', true), // Protocol
        'image.tascord.ai', // External URL
        true, // Force creation
    );

    brc.on('ready', () => {
        
        start_brc(brc.port)

        const api = new WebImplementation(
            'tsib', // Name
            new HTTPS('/etc/letsencrypt/live/bedroom.community/fullchain.pem', '/etc/letsencrypt/live/bedroom.community/privkey.pem', true), // Protocol
            'image.tascord.ai', // External URL
            true, // Force creation
        );
    
        api.on('ready', () => start_api(api.port));

    });

}