
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

		this.postFancyData(data.channel, stockData);
	}


  getData(symbol) {
    var options = {
      url: `https://finance.google.com/finance?q=${symbol}&output=json`
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


  async postFancyData(channel, stockData) {  
    const fields = []
    let titleString = `$${stockData.l} (${stockData.c.includes("+") ? `▲ ${stockData.c}` : `▼ ${stockData.c}`})`;
    if (!stockData.c) {
        titleString = `$${stockData.l}`;
    }

    fields.push({
      "title": "Last:",
      "value": titleString,
      "short": false
    });

    if (stockData.hi) {
      fields.push({
        "title": "High:",
        "value": `$${stockData.hi}`,
        "short": false
      });
    }

    if (stockData.lo) {
      fields.push({
        "title": "Low:",
        "value": `$${stockData.lo}`,
        "short": false
      });
    }
  
  
    this.postFancyMessage(stockData, channel, fields, "#DDDDDD");
  }

  async postFancyMessage(stockData, channel, fields, color) {    
    
    this.bot.postRawMessage(
        channel,
        {
          "icon_emoji": ":chart_with_upwards_trend:",
          "username": "StockCat",
          "attachments": [
              {
                "title": stockData.name,                  
                "color": color,
                "fields": fields,
                "footer": await this.getDJIIndex(),                
              }
          ]
        }
      );
  }

  async getDJIIndex() {
    const dow = await this.getData('DJI');
    return `Dow Jones Industrial - ${dow.l} (${dow.c})`;
  }


  help() {
    return 'Usage: `?stock <symbol>`';
  }
}
