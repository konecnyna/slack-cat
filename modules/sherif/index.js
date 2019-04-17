'use strict';

const template = `
.        🤠
    xxx
  x   x　x
👇   xx 👇
      x     x
      x     x
      👢     👢
`;

module.exports = class Asciimoji extends BaseModule {
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
