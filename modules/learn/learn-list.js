'use strict';
const util = require('util');

module.exports = class LearnsList {

	constructor(bot, model) {
		this.bot = bot;
		this.LearnsModel = model;
	}

	async getLearns(data) {
		
	    const params = {
	      where: {
	        name: data.user_text,
	      }
	    }

		const userData = await this.bot.userDataPromise(data.user);    
	    const learnData = await this.LearnsModel.findAll(params);
	    await this.bot.postMessage(data.channel, "I just PMed them to you.");
	    await this.bot.postMessageToUser(userData.user.name, "------------*Learns for _" + data.user_text + "_*------------");
	    learnData.forEach( async (row, index) => {
	    	const message = util.format("%d. %s", index + 1, row.get('learn'));
	      	await this.bot.postMessageToUser(userData.user.name, message);
	    });
	}
}