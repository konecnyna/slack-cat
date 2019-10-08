'use strict';

const EmojiFont = require('./emojifont.js');

module.exports = class EmojifontModule extends BaseModule {

  constructor(bot) {
    super(bot);
    this.emojiFont = new EmojiFont();
  }

  async handle(data) {
    if (data.args.map(x => x.toLowerCase()).includes("--theworks")) {
      this.bot.postMessage(data.channel, this.emojiFont.giveEmTheWorks());
    } else {
      this.bot.postMessage(data.channel, this.emojiFont.emojify(data.user_text));
    }
  }

  help() {
    return 'Usage: `?emojifont my phrase` to translate your phrase to emoji. Use ?emojifont --theworks for the works. Also aliased to ?emojify'
  }

  aliases() {
    return ['emojify']
  }

  getType() {
      return [BaseModule.TYPES.MODULE];
  }
}
