module.exports = function Image(i, o) {

    const { files } = i;
    const { token } = i.body;

    o.status(200).end();

}