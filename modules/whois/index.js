'use strict';

const USER_ID_REGEX = new RegExp(/\<\@(.*?)\>/);

module.exports = class WhoIs extends BaseModule {
  async handle(data) {
  	const match = USER_ID_REGEX.exec(data.user_text);
  	let userId = "";
  	if (match) {
  		userId = match[1];
  	} else {
  		userId = data.user_text;
  	}

  	const user = await this.bot.userDataPromise(userId);     	
  	if (user.error) {
  		this.bot.postMessage(data.channel, user.error);
  		return;
  	}

	this.bot.postMessage(data.channel, this.formatUserInfo(user));	  	     
  }

  formatUserInfo(user) {
  	return `*Here is what I know:*

*Name:* ${user.user.name || 'unknown'}
*Real Name:* ${user.user.profile.real_name || 'unknown'}
*Display Name:* ${user.user.profile.display_name || 'unknown'}
*Email:* ${user.user.profile.email || 'unknown'}
`
  }

  help() {
    return "Usage: `?helloworld2` should print:\n'Hello World Number 2!!!'";
  }
};
