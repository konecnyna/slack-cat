const googleTranslate = require('google-translate-api');

module.exports = class TranslateUtil {
  getTranslationLang(userText) {
    let langCode = 'en';
    var match = /to:([^\s]+)/.exec(userText);
    if (match !== null) {
      langCode = match[1];
      userText = userText.replace(match[0], '');
    }

    return {
      code: langCode,
      sanatizedInput: userText,
    };
  }

  async getLangCodeAndTranslate(userText) {
    let tranlationLang = this.getTranslationLang(userText);
    return this.translate(tranlationLang);
  }

  async translate(translationProps) {
    try {
      const message = await this.translateUserTextTo(translationProps);
      const romanization = this.parseRomization(message);
      if (romanization) {
        return `${message.text} (${romanization})`;
      }

      return message.text;
    } catch (e) {
      return `Something went wrong: ${
        e.message
      }. Please look for the code in the google translate URL: https://translate.google.com/#auto/zh-CN/hello`;
    }
  }

  translateUserTextTo(props) {
    return new Promise((resolve, reject) => {
      googleTranslate(props.sanatizedInput, { to: props.code, raw: 'ture' })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  parseRomization(res) {
    return (res.raw && JSON.parse(res.raw)[0][1][2]) || '';
  }
};
