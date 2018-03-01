'use strict';
const request = require('request');

const imgRegex = new RegExp(
  /"ou":"([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))"/,
  'g'
);

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36';
const botParams = {
  icon_emoji: ':frame_with_picture:',
  username: 'ImageCat',
};

module.exports = class GoogleImages extends BaseModule {
  async handle(data) {
    const body = await this.getData(data);
    
    if (data.args && data.args.includes("--random")) {
      const randomUrl = this.getRandomUrl(body, data);
      if (randomUrl) {
        this.bot.postMessageWithParams(data.channel, randomUrl, botParams);
        return;
      }              
    }

    const urls = this.getUrls(body, data);
    if (urls.length) {
      this.bot.postMessageWithParams(data.channel, urls[0], botParams);  
      return;
    }          

    this.bot.postMessageWithParams(data.channel, 'No results. :slightly_frowning_face:', botParams);
  }

  aliases() {
    return ['gif'];
  }

  help() {
    return 'Usage: `?gif <gif search term>` or `?summon <image query>`\nFlags `--random`';
  }

  getRandomUrl(body, data) {
    const urls = this.getUrls(body, data);        
    return urls[Math.floor(Math.random() * urls.length - 1)];    
  }

  getUrls(body, data) {
    var match = imgRegex.exec(body);

    if (match == null) {
      return false;
    }

    const urls = [];
    while (match != null) {
      // matched text: match[0]
      // match start: match.index
      // capturing group n: match[n]
      urls.push(match[1]);

      match = imgRegex.exec(body)
    }

    return urls;
  }

  getData(data) {
    var options = {
      url: "https://www.google.com/search",
      headers: {
        'User-Agent': userAgent,
      },
      qs: this.buildParams(data)
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
          console.error(error);
          return;
        }

        resolve(body);
      });
    });  
  }

  buildParams(data) {
    let params = {};

    params['tbm'] = "isch";        
    if (data.cmd === 'gif') {  
      params['tbs'] = "itp:animated";      
    }


    params['safe'] = "strict";
    if(data.args && data.args.includes("--nsfw")) {
      // Proceed with caution...
      params['safe'] = "off";
    }

    params["q"] = data.user_text;
    return params;
  }
};
