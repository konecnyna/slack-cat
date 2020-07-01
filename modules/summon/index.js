'use strict';
const request = require('request-promise');
const { getImages } = require('./images-client')
const { key } = config.getKey('giphy')

module.exports = class Summon extends BaseModule {
  async handle(data) {
    const { source, image } = await this.getMessageData(data)
    this.bot.postRawMessage(data.channel, {
      icon_emoji: ':frame_with_picture:',
      username: 'ImageCat',
      attachments: [
        {
          color: '#008373',
          fields: [],
          image_url: image,
          footer: source
        }
      ]
    });
  }

  async getMessageData(data) {
    let searchText = data.user_text;
    if (data.cmd.includes("reaction")) {
      searchText = `${searchText} reaction`
    }

    let image = "";
    const noSpaceText = searchText.replace(" ", "%20");
    const isSummon = data.cmd.includes("summon");
    const isRandom = data.args.includes("--random");
    if (isSummon) {
      image = await getImages(noSpaceText, isRandom);
    } else {
      image = await this.getData(noSpaceText, isRandom);
    }
    const source = isSummon ? `Source: https://www.bing.com/images/search?q=${noSpaceText}&FORM=HDRSC2` : "Giphy";
    return {
      image: image,
      source: source
    }
  }

  aliases() {
    return ['gif', 'reaction'];
  }

  help() {
    return 'Usage: `?gif <gif search term>` or `?summon <image query>`\nFlags `--random`';
  }
  async getData(searchTerm, random) {
    const giphy = {
      url: "https://api.giphy.com/v1/gifs/search",
      qs: {
        api_key: key,
        rating: "pg",
        q: searchTerm,
        limit: random ? 10 : 1
      },
      json: true
    };
    const { data } = await request(giphy);
    return data.random().images.downsized_large.url;
  }
};
