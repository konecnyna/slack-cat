'use strict';

module.exports = class Channel extends BaseModule {
  handle(data) {
    this.bot.postMessage(
      data.channel,
      `This channel's id is: \`${data.channel}\``
    );
  }

  help() {
    return 'Get current channels id';
  }
};
