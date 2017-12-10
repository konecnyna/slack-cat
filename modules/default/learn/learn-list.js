'use strict';

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
	    
	    learnData.map(row => {
	      	this.bot.postMessageToUser(userData.user.name, row.get('learn'));
	    });
	}

}