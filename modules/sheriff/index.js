'use strict';

const template = `
Howdy!
         🤠
    xxx
  x   x　x
👇   xx 👇
      x     x
      x     x
      👢     👢
`;

module.exports = class Sheriff extends BaseModule {
  async handle(data) {
    const argsSplit = data.user_text.split(' ');
    const emoji = argsSplit[0];

    if (!emoji || !emoji.includes(':') || !emoji.includes(':')) {
      this.bot.postMessage(data.channel, this.help());
      return;
    }

    this.bot.postMessage(data.channel, template.replace(/x/g, emoji));
  }

  help() {
    return 'Usage: `<emoji>`';
  }
};
