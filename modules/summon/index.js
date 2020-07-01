'use strict';
const request = require('request-promise');
const { getImages } = require('./images-client')
const { key } = config.getKey('giphy')

module.exports = class Summon extends BaseModule {
  async handle(data) {
    let searchText = data.user_text;
    if (data.cmd.includes("reaction")) {
      searchText = `${searchText} reaction`
    }

    let image = "";
    let noSpaceText = data.user_text.replace(" ", "%20");
    if (data.cmd.includes("summon")) {
      image = await getImages(noSpaceText, data.args.includes("--random"));
    } else {
      image = await this.getData(searchText);
    }

    this.bot.postRawMessage(data.channel, {
      icon_emoji: ':frame_with_picture:',
      username: 'ImageCat',
      attachments: [
        {
          color: '#008373',
          fields: [
            {
              title: `Top Result: ${data.user_text}`,
              short: false
            }
          ],
          image_url: image,
          footer: `Source: https://www.bing.com/images/search?q=${noSpaceText}&FORM=HDRSC2`
        }
      ]
    });
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
