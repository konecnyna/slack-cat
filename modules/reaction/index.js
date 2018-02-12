'use strict';
const cache = require('memory-cache');

module.exports = class Reactions extends BaseModule {
  async handle(data, modules) {
    // Heavy plus will plus user!  
    if (
      data.reaction === 'heavy_plus_sign' &&
      data.item_user &&
      data.item_user !== data.user
    ) {      
      if (cache.get(this.getPlusKey(data)) != null){
        // try to dup pluses
        return;
      }

      const module = modules['plus'];
      const userName = await module.bot.getUserNameFromId(data.item_user);
      module.plusUser(data.item.channel, userName.user.name);
      cache.put(this.getPlusKey(data), '', 5 * 60 * 1000, ()=>{});
    }
    
    if (data.reaction === "eggplant") {      
      this.bot.postMessage(data.item.channel, "( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)");      
    }
    
  }


  getPlusKey(data) {
    return `${data.item_user}${data.user}${data.item.channel}${data.item.reaction}`;
  }


  getType() {
    return BaseModule.TYPES.REACTIONS;
  }

  help() {
    return "Reactions module!";
  }
};
