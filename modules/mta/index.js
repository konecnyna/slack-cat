'use strict';
const moment = require('moment');
const MTA = require('./mta.js');
const mta = new MTA();

// \`\`\`${line.text.replace(/(<([^>]+)>)/ig,"").replace(/[\t]/ig, "")}\`\`\`

module.exports = class MTA extends BaseModule {
  async handle(data) {
  	if (!data.user_text) {
  		return;
  	}

  	if (data.args && data.args.includes('--stops')) {
  		this.postStops(data);
  		return;
  	}

  	if (data.cmd === 'mta-stop') {
  		this.postStopData(data);
  		return;
  	}

  	this.postStatus(data);
  }

  async postStops(data) {
	const stops = await mta.getStops();
	const userData = await this.bot.userDataPromise(data.user);    
	this.bot.postMessage(data.channel, `${userData.user.name} - I just sent them to you`);
  	this.bot.postMessageToUser(userData.user.name, `Here is a gist of stations: ${stops}`);              
  		
  }

  async postStopData(data) {
  	const stopId = data.user_text.toUpperCase();
  	const schedule = await mta.getStopSchedule(stopId);
  	
  	if (!schedule.schedule) {
  		this.bot.postMessage(data.channel, `Couldn't find: ${data.user_text}`);
  		return;
  	}

	this.bot.postRawMessage(
		  data.channel,
		  {
		  	"icon_emoji": ":train:",
		  	"username": await mta.getStopName(stopId),
		    "attachments": [
		        {
		            "color": mta.getSubwayColor(stopId[0]),
		            fields: [{
		            	title: "North Bound:",
						value: this.createDates(schedule, stopId, 'N'),
						short: false,
					},{
		            	title: "South Bound:",
						value: this.createDates(schedule, stopId, 'S'),
						short: false,
					}],
		            "footer": "ugh, the mta",                
		        }
		    ]
		  }
		);

  }

  createDates(schedule, stopId, direction) {
  	const times = schedule.schedule[stopId][direction].slice(0, 3).map(train => {
  		return new moment(train.arrivalTime * 1000).tz('America/New_York').format('h:mm a');	
  	});
  	
  	return times.join("\n");
  
  }

  async postStatus(data) {
  	const line = (await mta.status(data.user_text))[0];
  	if (!line.name) {
  		return;
  	}	
  	this.postMsg(data, line);
  }

	postMsg(data, line) {	
		this.bot.postRawMessage(
		  data.channel,
		  {
		  	"icon_emoji": ":train:",
		  	"username": line.name,
		    "attachments": [
		        {
		            "color": mta.getSubwayColor(line.name),
		            fields: [{
		            	title: "Status:",
						value: line.status,
						short: false,
					}],
		            "footer": "ugh, the mta",                
		        }
		    ]
		  }
		);
	}


  help() {
    return 'MTA Status';
  }

  aliases() {
    return ['mta-stop'];
  }
};
