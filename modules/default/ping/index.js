'use strict';

module.exports = class Ping extends BaseModule {
  handle(data) {
    if (data.args && data.args.includes('--args')) {
      this.bot.postMessage(data.channel, 'pong with --args args!!!');
      return;
    }

    this.bot.postMessage(data.channel, 'pong');
  }

  help() {
    return 'The bot should respond with pong. For debugging purposes';
  }

  aliases() {
    return ['ding'];
  }
};
