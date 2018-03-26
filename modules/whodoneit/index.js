'use strict';

const TEMPLATE = 

module.exports = class Crypto extends BaseModule {
  async handle(data) {
    if (!data.user_text) {
    	this.bot.postMessage(data.channel, this.help());
    	return;
    }

    const text = `:point_down: :point_down: :point_down:
:point_right: ${data.user_text} :point_left: 
:point_up: :point_up: :point_up:
`
	this.bot.postMessage(data.channel, text);
  }



  help() {
    return 'Usage `?whodoneit <emoji>';
  }
}
