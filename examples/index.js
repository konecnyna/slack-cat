const { SlackCat, SlackCatEvents } = require('../index');
const Path = require('path');

const configPath = Path.join(__dirname, 'config.json');
const dbPath = Path.join(__dirname, 'db.sqlite');

SlackCatEvents.subscribe(SlackCatEvents.EventTypes.SetupComplete, (args) => {
  console.log("Slackcat is now active!");
})

// No modules in example.
new SlackCat('', configPath, dbPath, true).start();
