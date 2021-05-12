const { join } = require('path');

const database_location = join(__dirname, '../', '../', 'data-testing.sqlite');
const quickdb = require('quick.db')(database_location);

module.exports = function Table(name) {
    if(!name) throw new Error('No name provided.');
    return new quickdb.table(name);
}