const SlackCat = require('../index.js');
const Path = require('path');


const configPath = Path.join(__dirname, 'config.dat')
const dbPath = Path.join(__dirname, 'db.sqlite');
const modules = Path.join(__dirname, '/modules');

new SlackCat(modules, configPath, dbPath).start();