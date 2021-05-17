const gm = require('gm');

const Table = require('./Data');
const Images = Table('Images');

class Image {

    constructor(opts = {}) {

        let name = 'name' in opts ? opts['name'] : null;
        let id = 'id' in opts ? opts['id'] : null;

    }

    static upload = (path, name, type) => new Promise((resolve, reject) => {

        

    })

}