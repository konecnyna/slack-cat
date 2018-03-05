'use strict';
const MTA = require('./mta.js');
const mta = new MTA();

// \`\`\`${line.text.replace(/(<([^>]+)>)/ig,"").replace(/[\t]/ig, "")}\`\`\`

module.exports = class MTA extends BaseModule {
  async handle(data) {
  	if (!data.user_text) {
  		return;
  	}
  	
  	this.postStatus(data);
  }

  async postStatus(data) {
  	const line = (await mta.status(data.user_text))[0];  	
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
    return [];
  }
};
