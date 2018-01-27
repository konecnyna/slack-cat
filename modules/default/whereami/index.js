'use strict';
const exec = require('child_process').exec;


module.exports = class WhereAmI extends BaseModule {
  async handle(data) {
    this.bot.postMessage(data.channel, "Resolving ip...");
    exec("curl ifconfig.me", (error, stdout, stderr) => {
      this.bot.postMessage(data.channel, "http://" + stdout);      
    });
  }


  help() {
    return 'This should return the ip of the remote server.';
  }
};
