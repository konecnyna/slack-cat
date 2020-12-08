const request = require('request');
const util = require('util');

module.exports = class Crypto extends (
  BaseModule
) {
  async handle(data) {
    if (data.user_text.length > 0) {
      this.getSingleCrypto(data);
      return;
    }

    this.postFancyData(data);
  }

  async getSingleCrypto(data) {
    try {
      const cryptoData = await this.getSingleCryptoByTicker(data.user_text);
      const fields = [
        {
          title: data.user_text,
          value: `$${cryptoData.USD.toFixed(2)}`,
          short: false,
        },
      ];
      this.postFancyMessage(data, fields, '#4CAF50');
    } catch (e) {
      this.bot.postMessage(data.channel, `${data.user_text} not found. :(`);
    }
  }

  async postFancyData(data) {
    const cryptoPrices = await this.getTopCryptoPrices();
    const fields = cryptoPrices.map((crypto) => {
      return {
        title: crypto.name,
        value: `$${crypto.current_price}`,
        short: false,
      };
    });

    this.postFancyMessage(data, fields, '#FFC107');
  }

  postFancyMessage(data, fields, color) {
    this.bot.postRawMessage(data.channel, {
      icon_emoji: ':moneybag:',
      username: 'CryptoCat',
      attachments: [
        {
          color: color,
          fields: fields,
          footer: 'More symbols: https://www.coingecko.com/en',
        },
      ],
    });
  }

  getTopCryptoPrices() {
    var options = {
      url:
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=24h',
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
          console.error('error', error);
          return;
        }

        resolve(JSON.parse(body));
      });
    });
  }

  getSingleCryptoByTicker(id) {
    var options = {
      url: util.format(
        'https://min-api.cryptocompare.com/data/price?fsym=%s&tsyms=USD',
        id.toUpperCase()
      ),
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
          console.error('error', error);
          return;
        }

        resolve(JSON.parse(body));
      });
    });
  }

  help() {
    return 'Get duh latest crypto info. `?crypto <symbol name>`. List of symbols: https://www.coingecko.com/en';
  }
};
