'use strict';
const request = require('request-promise');
const { key } = config.getKey('giphy')
const botParams = {
  icon_emoji: ':frame_with_picture:',
  username: 'ImageCat',
};

module.exports = class GoogleImages extends BaseModule {
  async handle(data) {
    let searchText = data.user_text;
    if (data.cmd.includes("reaction")) {
      searchText = `${searchText} reaction`
    }
    const gif = await this.getData(data.user_text);
    this.bot.postMessageWithParams(data.channel, gif, botParams);
  }

  aliases() {
    return ['gif', 'reaction'];
  }

  help() {
    return 'Usage: `?gif <gif search term>` or `?summon <image query>`\nFlags `--random`';
  }

  getRandomUrl(body, data) {
    const urls = this.getUrls(body, data);
    return urls[Math.floor(Math.random() * urls.length - 1)];
  }

  async getData(searchTerm) {
    const giphy = {
      url: "https://api.giphy.com/v1/gifs/random",
      qs: {
        api_key: key,
        rating: "pg",
        tag: searchTerm
      },
      json: true
    };
    const { data } = await request(giphy);
    return data.image_url;
  }
};
