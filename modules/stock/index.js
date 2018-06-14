'use strict';
const request = require('request');

const key = config.getKey('stock');


const DATA_HIGH_KEY = '2. high';
const DATA_LOW_KEY = '3. low';
const DATA_CLOSE_KEY = '4. close';

module.exports = class Stock extends BaseModule {
  async handle(data) {
    if (!data.user_text) {
      this.bot.postMessage(data.channel, this.help());
      return;
    }

    try {
      const stockData = await this.getData(data.user_text);

      if (!stockData) {
        this.bot.postMessage(data.channel, `Couldn't find ${data.user_text}`);
        return;
      }

      this.postFancyData(data, stockData);
    } catch (e) {
      this.bot.postMessage(data.channel, `I got an error: ${e}`);
    }    
  }

  getData(symbol) {
    var options = {
      url: `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${key}`,
      timeout: 45000
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        const json = JSON.parse(body);
        if (error || json['Error Message']) {
          reject(error || json['Error Message']);
          console.error(error || json['Error Message']);
          return;
        }

        const seriesData = json['Time Series (60min)'];        
        resolve(seriesData[Object.keys(seriesData)[0]]);
      });
    });
  }

  async postFancyData(data, stockData) {
    const fields = [];
    let titleString = `$${stockData.l}`;

    if (stockData.c) {
      titleString = `$${stockData.l} (${stockData.c})`;
    }

    fields.push({
      title: 'Last:',
      value: stockData[DATA_CLOSE_KEY],
      short: false,
    });

    if (stockData[DATA_HIGH_KEY]) {
      fields.push({
        title: 'High:',
        value: `$${stockData[DATA_HIGH_KEY]}`,
        short: false,
      });
    }

    if (stockData[DATA_LOW_KEY]) {
      fields.push({
        title: 'Low:',
        value: `$${stockData[DATA_LOW_KEY]}`,
        short: false,
      });
    }

    this.postFancyMessage(stockData, data, fields);
  }

  async postFancyMessage(stockData, data, fields, isPositive) {
    let icon = ":bar_chart:";
    if (stockData.c && stockData.c.includes('-')) {
      icon = ':chart_with_downwards_trend:';
    } else if (stockData.c && stockData.c.includes('+')) {
      icon = ':chart_with_upwards_trend:';
    }

    this.bot.postRawMessage(data.channel, {
      icon_emoji: icon,
      username: 'StockCat',
      attachments: [
        {
          title: data.user_text.toUpperCase(),
          //color: this.getStockStatusColor(stockData),
          fields: fields,
          footer: `https://finance.google.com/finance?q=${data.user_text}`,
        },
      ],
    });
  }

  getStockStatusColor(stockData) {
    if (!stockData || !stockData.c) {
      return '#dddddd';
    }

    if (stockData.c.includes('+')) {
      return '#4CAF50';
    }

    if (stockData.c.includes('-')) {
      return '#F44336';
    }

    return '#dddddd';
  }

  async getDJIIndex() {
    const dow = await this.getData('DJI');
    return `Dow Jones Industrial - ${dow[DATA_LOW_KEY]}`;
  }

  help() {
    return 'Usage: `?stock <symbol>`';
  }
};
