const SlackCat = require('slack-cat');
const Path = require('path');


const configPath = Path.join(__dirname, 'config.dat')
const dbPath = Path.join(__dirname, 'db.sqlite');

new SlackCat('',configPath, dbPath).start();