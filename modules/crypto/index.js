const request = require('request');
const util = require('util');

const BASE_URL = "https://min-api.cryptocompare.com/data/price?fsym=%s&tsyms=USD"

const bitcoin = "BTC";
const ethereum = "ETH";
const lightCoin = "LTC";

module.exports = class Crypto extends BaseModule {
  async handle(data) {
    if (data.user_text.length > 0) {
      this.getSingleCrpto(data);
      return;
    }

    this.postFancyData(data);
  }


  async getSingleCrpto(data) {
    
    try {
      const cryptoData = await this.getCryptoPrice(data.user_text);
      const fields = [
        { 
            "title": data.user_text,
            "value": `$${cryptoData.USD.toFixed(2)}`,
            "short": false
        }
      ];
      this.postFancyMessage(data, fields, "#4CAF50");
    } catch(e) {
      this.bot.postMessage(data.channel, `${data.user_text} not found. :(`);
    }
  }


  async postFancyData(data) {  
  	const bitcoinPrice = await this.getCryptoPrice(bitcoin);
  	const ethereumPrice = await this.getCryptoPrice(ethereum);
  	const lightCoinPrice = await this.getCryptoPrice(lightCoin);
    
    const fields = [
        {
            "title": "Bitcoin:",
            "value": `$${bitcoinPrice.USD.toFixed(2)}`,
            "short": false
        },
        {
            "title": "Ethereum:",
            "value": `$${ethereumPrice.USD.toFixed(2)}`,
            "short": false
        },
        { 
            "title": "LiteCoin:",
            "value": `$${lightCoinPrice.USD.toFixed(2)}`,
            "short": false
        }
          
    ];
    
  
    this.postFancyMessage(data, fields, "#FFC107");
  }

  postFancyMessage(data, fields, color) {    
    this.bot.postRawMessage(
        data.channel,
        {
          "icon_emoji": ":moneybag:",
          "username": "CryptoCat",
          "attachments": [
              {
                  "color": color,
                  "fields": fields,
                  "footer": "More symbols: https://www.cryptocompare.com/coins/list/USD/1",                
              }
          ]
        }
      );
  }

  getCryptoPrice(id) {
    var options = {
      url: util.format(BASE_URL, id.toUpperCase()),      
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
          console.error("error", error);
          return;
        }

        resolve(JSON.parse(body));
      });
    });  
  }


  help() {
    return 'Get duh latest crypto info. `?crypto <symbol name>`. List of symbols: https://www.cryptocompare.com/coins/list/USD/1';
  }
}
