'use strict';

const fs = require('fs');
const path = require('path');
const Config = require('./core/config.js');


// Start app.
const Router = require('./core/router.js');

// Global Base Modules.
global.BaseModule = require('./core/base-module.js');
global.BaseStorageModule = require('./core/storage-base-module.js');
    

const testMsg = { 
	type: 'message',
	channel: 'C7XPH1X8V',
	user: 'U7YMR8S3H',
	text: '',
	ts: '1510420686.000031',
	source_team: 'T7XPH1Q4V',
	team: 'T7XPH1Q4V' 
}


// Run debug cmds.
if (process.argv.length > 2) {	
	testMsg.text = process.argv.splice(2, process.argv.length - 1).join(" ");
	console.log("Executing: " + testMsg.text);
	const MockBot = require(path.join(__dirname + '/core', 'mock-bot.js'));
	const router = new Router(new MockBot());
	router.handle(testMsg);
	return;
} 




// Require after debug so we don't spin up the server if we are debugging.
const SlackCatBot = require('./core/slack-cat-bot.js');

class SlackCat {
     constructor(pathToModules, configPath, dbPath) {
     	this.pathToModules = pathToModules;
     	this.dbPath = dbPath;

     	global.STORAGE_PATH = dbPath;     	
     	global.config = new Config(configPath);
     }


     start() {     	
		const bot = new SlackCatBot({
		  token: config.getKey('slack_api'), // Add a bot https://my.slack.com/services/new/bot and put the token
		  name: 'SlackCat',
		});
		const router = new Router(bot, this.pathToModules);

		bot.on('start', () => {
		  console.info('Starting server in ' + process.env.NODE_ENV + ' mode.');
		});

		bot.on('message', data => {
		  router.handle(data);
		});
     }

}

module.exports = SlackCat;
