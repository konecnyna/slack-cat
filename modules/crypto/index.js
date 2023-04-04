const request = require('request');
const util = require('util');

const COIN_GECKO_URL = 'https://www.coingecko.com/en';

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
      this.bot.postMessage(
        data.channel,
        `${data.user_text} not found. See coins: ${COIN_GECKO_URL}`
      );
    }
  }

  async postFancyData(data) {
    const cryptoPrices = await this.getTopCryptoPrices();
    if (!cryptoPrices.length) {
      console.log("failed to reterive top crypto")
      return
    }

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
          footer: `More symbols: ${COIN_GECKO_URL}`,
        },
      ],
    });
  }

  getTopCryptoPrices() {
    var options = {
      'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
      url: 'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=5&tsym=USD',
      json: true
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.log('error', error, response.statusCode);
          resolve([]);
          return;
        }
        resolve(body["Data"].map(coin => {

          return {
            name: coin["CoinInfo"]["Name"],
            current_price: coin["DISPLAY"]["USD"]["PRICE"].replace("$", "").trim()
          }
        }));
      });
    });
  }

  getSingleCryptoByTicker(id) {
    var options = {
      url: `https://min-api.cryptocompare.com/data/price?fsym=${id.toUpperCase()}&tsyms=USD`,
      json: true
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
          console.error('error', error);
          return;
        }

        resolve(body);
      });
    });
  }

  help() {
    return `Get duh latest crypto info. \`?crypto <symbol name>\`. List of symbols: ${COIN_GECKO_URL}`;
  }
};
