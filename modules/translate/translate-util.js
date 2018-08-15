const translationLangRegex = /to:([^\s]+)/g;
const googleTranslate = require('google-translate-api');

module.exports = class TranslateUtil {
  getTranslationLang(userText) {
    let lang = 'en';
    var match = translationLangRegex.exec(userText);
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
      console.log('Something went wrong: ', e.message);
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
