// Load secrets needed.
const fs = require('fs');
const path = require('path');

try {
	const contents = fs.readFileSync('secrets.dat');
	secrets = JSON.parse(contents);			
	process.env.SLACK_API_KEY = secrets.slackapi;

	if (secrets.darksky_api) {
		process.env.DARK_SKIES_API_KEY = secrets.darksky_api;	
	}
} catch(err) {
	throw new Error("Must provide slack api keys\n\n\n");
}



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


const SlackCat = require('./core/slackcat.js');
const bot = new SlackCat({
  token: process.env.SLACK_API_KEY, // Add a bot https://my.slack.com/services/new/bot and put the token
  name: 'SlackCat',
});
const router = new Router(bot);

bot.on('start', () => {
  console.info('Starting server in ' + process.env.NODE_ENV + ' mode.');
});

bot.on('message', data => {
  router.handle(data);
});
