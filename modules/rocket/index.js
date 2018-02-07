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
    
    if (data.cmd === 'falcon-heavy') {
      rocketShip = falconHeavy;
    }

    for (let i = 0; i < 40; i++) {
        	rocketShip += "\n   000000";
        }

        rocketShip += "\n```";

        this.bot.postMessage(data.channel, rocketShip, {
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
