const { existsSync, readdirSync } = require('fs');
const { join } = require('path');

const app = require('express')();
app.use(require('body-parser').json());
app.listen(3001, () => console.log('Started Server'));

const cors = require('cors');
app.use(cors());

const routes = {};
readdirSync(join(__dirname, 'server', 'api', 'routes')).forEach(file => {
    routes[file.slice(0, -3).toLowerCase()] = require(join(__dirname, 'server', 'api', 'routes', file));
})

app.get('*', (req, res) => {
    res.redirect('http://localhost:3000');
});

app.post('*', (req, res) => {
    
    let path = req.path.slice(1) || 'index';

    console.log(`[/${path}] ${JSON.stringify(req.body)}`);

    if(routes[path]) routes[path](req, res);
    else res.status(404).end();

})