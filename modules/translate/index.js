'use strict';

const TranslateUtil = require('./translate-util');
const translateUtil = new TranslateUtil();

module.exports = class Translate extends BaseModule {
  async handle(data) {
    if (data.user_text.length === 0) {
      this.bot.postMessage(
        data.channel,
        'You forgot to give me something to tranlsate!'
      );
      return;
    }

    let msg = '';
    if (data.cmd === 'tocn') {
      msg = await translateUtil.translate({
        code: 'zh-CN',
        sanatizedInput: data.user_text,
      });
    } else {
      msg = await translateUtil.getLangCodeAndTranslate(data.user_text);
    }

    this.bot.postMessage(data.channel, msg);
  }

  aliases() {
    return ['tocn'];
  }

  help() {
    return `?translate - Will translate the previous line to english. Use "to:<letter lang> anywhere to set a translation language.\n Example ?translate hello friend! to:zh-CH.\n\n\nTo find a language code visit google translate and select the language you prefer. You will find the code in the url eg: https://translate.google.com/#auto/zh-CN/hello - [zh-CN] is the code for chinese.`;
  }
};
