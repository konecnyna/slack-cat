'use strict';
const request = require('request');
const regex = /"(.*?)"/g;

module.exports = class Meme extends BaseModule {
  async handle(data) {
    if (!data.user_text) {
      return;
    }

    
    let group;
    const text = [];
    while(group = regex.exec(data.user_text)) {
      text.push(group[1]);      
      if (text.length === 2) {
        break;
      }
    }

    const url = await this.imgflip({
      template_id: '2743696',
      username: 'daasdasda',
      password: 'crossword',
      text0: text[0], 
      text1: text[1],
    });

    this.bot.postMessage(data.channel, url);
  }

async imgflip(params) {  
  return new Promise((resolve, reject) => {
    try {
      request.post({
        url: `https://api.imgflip.com/caption_image`,    
        form: params    
      }, (error, response, body) => {
        resolve(JSON.parse(body).data.url);
      });
    } catch (e) {
      reject(e);
    }
    
  }); 
}
  

  help() {
    return '?meme <meme_name> "top_text" "bottom_text"';
  }

  aliases() {
    return ['khan'];
  }
};
