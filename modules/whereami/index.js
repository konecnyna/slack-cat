'use strict';

const publicIp = require('public-ip');

module.exports = class WhereAmI extends BaseModule {
  async handle(data) {
    this.bot.postMessage(data.channel, 'Resolving ip...');
    const ip = await publicIp.v4();
    this.bot.postMessage(data.channel, 'http://' + ip);
  }

  help() {
    return 'This should return the ip of the remote server.';
  }
};
