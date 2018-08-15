'use strict';

module.exports = class HelloWorld extends BaseModule {
  handle(data) {
    this.bot.postMessage(data.channel, 'Hello World!!!');
  }

  help() {
    return "Usage: `?helloworld2` should print:\n'Hello World Number 2!!!'";
  }
};
