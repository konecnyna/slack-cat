const googleTranslate = require('google-translate-api');

module.exports = class TranslateUtil {
  getTranslationLang(userText) {
    let lang = 'en';
    var match = /to:([^\s]+)/.exec(userText);
    if (match !== null) {
      lang = match[1];
      userText = userText.replace(match[0], '');
    }

    return {
      input: lang,
      sanatizedInput: userText,
    };
  }

  async translate(userText) {
    try {
      let tranlationLang = this.getTranslationLang(userText);
      const message = await this.translateUserTextTo(
        tranlationLang.sanatizedInput,
        tranlationLang.input
      );

      return message.text;
    } catch (e) {
      return `Something went wrong: ${
        e.message
      }. Please look for the code in the google translate URL: https://translate.google.com/#auto/zh-CN/hello`;
    }
  }

  translateUserTextTo(text, toLang) {
    return new Promise((resolve, reject) => {
      googleTranslate(text, { to: toLang })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
