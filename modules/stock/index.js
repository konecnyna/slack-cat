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
      url: `https://finance.google.com/finance?q=${symbol}&output=json`,
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
          console.error(error);
          return;
        }

        resolve(JSON.parse(body.replace('//', ''))[0]);
      });
    });
  }

  async postFancyData(channel, stockData) {
    const fields = [];
    let isPositive = false;
    let titleString = `$${stockData.l}`;

    if (stockData.c) {
      titleString = `$${stockData.l} (${
        isPositive ? `${stockData.c}` : `${stockData.c}`
      })`;

      isPositive = !stockData.c.includes('-');
    }

    fields.push({
      title: 'Last:',
      value: titleString,
      short: false,
    });

    if (stockData.hi) {
      fields.push({
        title: 'High:',
        value: `$${stockData.hi}`,
        short: false,
      });
    }

    if (stockData.lo) {
      fields.push({
        title: 'Low:',
        value: `$${stockData.lo}`,
        short: false,
      });
    }

    this.postFancyMessage(stockData, channel, fields, isPositive);
  }

  async postFancyMessage(stockData, channel, fields, isPositive) {
    const icon = isPositive
      ? ':chart_with_upwards_trend:'
      : ':chart_with_downwards_trend:';
    this.bot.postRawMessage(channel, {
      icon_emoji: icon,
      username: 'StockCat',
      attachments: [
        {
          title: stockData.name,
          color: this.getStockStatusColor(stockData),
          fields: fields,
          footer: await this.getDJIIndex(),
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
    return `Dow Jones Industrial - ${dow.l} (${dow.c})`;
  }

  help() {
    return 'Usage: `?stock <symbol>`';
  }
};
