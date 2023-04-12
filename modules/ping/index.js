'use strict';
const exec = require('child_process').exec;

module.exports = class Ping extends BaseModule {
  handle(data) {
    if (data.args && data.args.includes('--args')) {
      this.bot.postMessage(data.channel, 'pong with --args args!!!');
      return;
    }

    if (data.cmd === 'ding') {
      this.bot.postMessage(data.channel, 'dong');
      return;
    }

    if (data.user_text) {
      let url = data.user_text.replace('<', '');
      url = url.replace('>', '');
      url = url.replace('http://', '');
      url = url.replace('https://', '');

      if (url.includes('|')) {
        url = url.split('|')[0];
      }

      this.ping(data, url);
      return;
    }

    this.bot.postMessage(data.channel, 'pong');
  }

  ping(data, url) {
    this.bot.postMessage(data.channel, 'Pinging: ' + url);
    exec('ping -c 3 ' + url, (error, stdout, stderr) => {
      this.bot.postMessage(data.channel, stderr ? stderr : stdout);
    });
  }

  help() {
    return 'The bot should respond with pong. For debugging purposes';
  }

  aliases() {
    return ['ding'];
  }
};
