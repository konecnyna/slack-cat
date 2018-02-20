
'use strict';
const request = require('request');


module.exports = class Stock extends BaseModule {
	async handle(data) {
    if (!data.user_text) {
      this.bot.postMessage(data.channel, this.help());
      return;
    }

		const stockData = await this.getData(data.user_text);

    if (!stockData) {
      this.bot.postMessage(data.channel, `Couldn't find ${data.user_text}`);
      return;
    }

		this.bot.postMessage(data.channel, `${stockData.name} -  $${stockData.l}`);		
	}


  getData(symbol) {
    var options = {
      url: `https://finance.google.com/finance?q=NASDAQ:${symbol}&output=json`
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
          console.error(error);
          return;
        }

        resolve(JSON.parse(body.replace("//", ""))[0]);
      });
    });  
  }


  help() {
    return 'Usage: `?stock <symbol>`';
  }
}
