const request = require('request');
const util = require('util');

const BASE_URL = "https://min-api.cryptocompare.com/data/price?fsym=%s&tsyms=USD"

const bitcoin = "BTC";
const ethereum = "ETH";
const lightCoin = "LTC";

module.exports = class Crypto extends BaseModule {
  async handle(data) {
	this.postFancyData(data);
  }


  async postFancyData(data) {  
  	const bitcoinPrice = await this.getCryptoPrice(bitcoin);
  	const ethereumPrice = await this.getCryptoPrice(ethereum);
  	const lightCoinPrice = await this.getCryptoPrice(lightCoin);
    
    const fields = [
      {
              "title": "Bitcoin:",
              "value": `$${bitcoinPrice.USD}`,
              "short": false
          },
          {
              "title": "Ethereum:",
              "value": `$${ethereumPrice.USD}`,
              "short": false
          },
          { 
              "title": "LightCoin:",
              "value": `$${lightCoinPrice.USD}`,
              "short": false
          }
          
    ]

    this.bot.postRawMessage(
        data.channel,
        {
          "icon_emoji": ":moneybag:",
          "username": "CryptoCat",
          "attachments": [
              {
                  "color": "#90c564",
                  "fields": fields,
                  "footer": "brochaco",                
              }
          ]
        }
      );
  
  }

  getCryptoPrice(id) {
    var options = {
      url: util.format(BASE_URL, id),      
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
    return 'Get duh latest crypto info.';
  }
}
