'use strict';
const axios = require('axios');
const secrets = config.getKey('apiflip');

const templates = {
  "onds": "61579",
  "khan": "2743696"
}

module.exports = class Meme extends BaseModule {
  async handle(data) {
    const { cmd, channel, user_text } = data;
    if (!user_text) {
      return this.bot.postMessageToThread(channel, this.help());
    }

    if (cmd === "odns") {
      const odnsUrl = await this.handleOdns(user_text);
      return this.bot.postMessage(channel, odnsUrl);
    }
    const captions = this.getCaptions(user_text);
    if (!captions) {
      return this.bot.postMessageToThread(channel, this.help());
    }

    const url = await this.getMemeImage(templates["khan"], captions.top, captions.bottom);
    this.bot.postMessage(channel, url);
  }

  getCaptions(user_text) {
    const group = new RegExp(/"(.*)"\s"(.*)"/, 'gm').exec(user_text)
    if (!group) {
      return null;
    }

    return {
      top: group[1] || " ",
      bottom: group[2] || " "
    }
  }

  async handleOdns(user_text) {
    return this.getMemeImage(templates["onds"], "One does not simply", user_text)
  }

  async getMemeImage(template_id, topText, bottomText) {
    console.log(topText, bottomText)
    const params = {
      template_id,
      username: secrets.username,
      password: secrets.password,
      text0: topText || " ",
      text1: bottomText || " ",
    };

    try {
      const { data } = await axios.post("https://api.imgflip.com/caption_image", null, { params });
      return data.data.url;
    } catch (e) {
      console.log(e);
    }
  }


  help() {
    return '?meme <meme_name> "top_text" "bottom_text"';
  }

  aliases() {
    return ['khan', 'odns'];
  }
};
