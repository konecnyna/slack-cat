'use strict';

  const rocket = "```\n\
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

const falconHeavy = "```\n\
   :car:     \n\
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


module.exports = class Rocket extends BaseModule {
  handle(data) {
    let rocketShip = rocket 
    
    if (data.cmd === 'alcon-heavy') {
      rocketShip = falconHeavy;
    }

    for (let i = 0; i < 40; i++) {
        	rocket += "\n   000000";
        }

        rocket += "\n```";

        this.bot.postMessage(data.channel, rocket, {
    	  icon_emoji: ':rocket:',
    	});	
    }


  aliases() {
    return ['falcon-heavy'];
  }

  help() {
    return "Usage: get shit off the screen!";
  }
};
