const SlackCat = require('../index');
const Path = require('path');

const configPath = Path.join(__dirname, 'config.json');
const dbPath = Path.join(__dirname, 'db.sqlite');

// No modules in example.
new SlackCat('', configPath, dbPath).start();
