const { GenerateID, User, GetUserByAuth } = require('../User');
const fetch = require('node-fetch');

const token_options = {
    client_id: '571966498189344778',
    client_secret: 'xJ5SyOQTgMG_UZo8t906nPBWojtPFtTZ',
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:3000/discord',
    scope: 'identity'
}

module.exports = function DiscordLogin(i, o) {

    let { code } = i.body;
    if(!code) return o.status(400).end('Missing code');

    let payload = token_options;
    payload.code = code;

    fetch('https://discord.com/api/oauth2/token', { method: 'POST', body: new URLSearchParams(payload), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => res.json()).then((data) => {

        if (data.error) return o.status(400).end(`Discord OAuth error: '${data.error}'`);
        else {

            fetch('https://discordapp.com/api/users/@me', { method: 'GET', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': `${data.token_type} ${data.access_token}` }, }).then(res => res.json()).then(user => {

                let saved_user = GetUserByAuth('d:' + user.id);
                if(!saved_user) saved_user = new User({ auth: 'd:' + user.id, id: GenerateID(), username: user.username });
                else saved_user = new User(saved_user);

                saved_user.generateToken();
                saved_user.save();

                return o.json({token: saved_user.token});

            });

        }

    });


}