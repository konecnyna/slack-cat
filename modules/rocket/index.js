'use strict';

const rocket = `
     /\\      
    /  \\      
    |==|      
    |  |      
    |  |      
    |  |      
   /____\\      
   |    |      
   |    |      
   |    |      
   |    |      
   |    |      
   |    |      
   |    |      
   |    |      
   |    |      
   |    |      
  /| |  |\\      
 / | |  | \\      
/__|_|__|__\\      
   /_\\/_\\    
`;

module.exports = class Rocket extends BaseModule {
  handle(data) {
    let rocketShip = rocket;
    for (let i = 0; i < 50; i++) {
      rocketShip += '\n   000000';
    }

    rocketShip = `\`\`\`${rocketShip}\n\`\`\``;

    this.bot.postMessage(data.channel, rocketShip, {
      icon_emoji: ':rocket:',
    });
  }

  help() {
    return 'Usage: get shit off the screen!';
  }
};
