'use strict';



module.exports = class Rocket extends BaseModule {
  handle(data) {
	let rocket = "```\n\
     /\\      \n\
    /  \\      \n\
    |==|      \n\
    |  |      \n\
    |  |      \n\
    |  |      \n\
   /____\\      \n\
   |    |      \n\
   |    |      \n\
   |    |      \n\
   |    |      \n\
   |    |      \n\
   |    |      \n\
   |    |      \n\
   |    |      \n\
   |    |      \n\
   |    |      \n\
  /| |  |\\      \n\
 / | |  | \\      \n\
/__|_|__|__\\      \n\
   /_\\/_\\    ";



    for(let i = 0; i < 40; i++) {
    	rocket += "\n   000000";
    }

    rocket += "\n```";

    this.bot.postMessage(data.channel, rocket, {
	  icon_emoji: ':rocket:',
	});	
  }

  help() {
    return "Usage: get shit off the screen!";
  }
};
