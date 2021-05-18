const gm = require('gm');

const Table = require('./Data');
const Images = Table('Images');

const { join } = require('path');
const { unlinkSync } = require('fs');

class Image {

    constructor(opts = {}) {

        this.id = opts['id'] || this.generate_id();

        this.name = opts['name'];
        this.type = opts['type'];

        this.low = opts['low'];
        this.high = opts['high'];

        if (!this.low && !this.high) throw new Error('Invalid image data provided');

    }

    generate_id = () => {

        const alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');
        let id;

        do {
            id = 'ttttttttttttt-xxxx-xxxx-xxxx'
                .replace(/t{13}/, () => Date.now())
                .replace(/x/g, () => alpha[Math.floor(Math.random() * alpha.length)]);
        }

        while (
            Images.has(id)
        )

        return id;

    }

    save = () => {
        if (!this.id) return;
        Images.set(this.id, this);
    }

    static upload = (name, path) => new Promise((resolve, reject) => {

        let data = {};
        console.log(path);

        // High Quality
        gm(path)
            .noProfile() // Strip EXIF
            .toBuffer((err, buffer) => {

                if (err) return reject(err);

                data.high = {
                    size: buffer.length,
                    data: buffer.toString('base64')
                }

                // Low quality
                gm(path)
                    .noProfile() // Strip EXIF
                    .resize(180, 180 * (1080 / 1920))
                    .compress('Lossless')
                    .toBuffer((err, buffer) => {

                        if (err) return reject(err);

                        data.low = {
                            size: buffer.length,
                            data: buffer.toString('base64')
                        }

                        let image = new Image(data);
                        unlinkSync(path);
                        image.save();

                        return image;

                    })

            })


    })

}

const getImageById = (id) => {

    return Images.get(id);

}

module.exports = {
    Image,
    getImageById
}