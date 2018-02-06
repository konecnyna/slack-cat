'use strict';

module.exports = class Reactions extends BaseModule {
  async handle(data, modules) {
    // Heavy plus will plus user!
    if (
      data.reaction === 'heavy_plus_sign' &&
      data.item_user &&
      data.item_user !== data.user
    ) {
      const module = modules['plus'];
      const userName = await module.bot.getUserNameFromId(data.item_user);
      module.plusUser(data.item.channel, userName.user.name);
    }
    
    if (data.reaction === "eggplant") {      
      this.bot.postMessage(data.item.channel, "( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)");      
    }
    
  }

  getType() {
    return BaseModule.TYPES.REACTIONS;
  }

  help() {
    return "Reactions module!";
  }
};
