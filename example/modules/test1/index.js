'use strict';


module.exports = class Test1 extends BaseModule {
  handle(data) {
    this.bot.postMessage(data.channel, "hello!");
  }

  help() {
    return "Dis is a test";
  }


  getType() {
    return BaseModule.TYPES.MODULE;
  }
};