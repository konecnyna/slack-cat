'use strict';
const publicIp = require('public-ip');


module.exports = class LearnsList {
  constructor(bot, model) {
    this.bot = bot;
    this.LearnsModel = model;

    
  }

  async createRoutes(app) {
    app.get('/', async (req, res) => {
      const params = {
        where: {}
      };

      switch (req.query.text) {
        case "allText":
          params.where['learn_type'] = 'quote';
          break;
        case "allImages":
          params.where['learn_type'] = 'image';
          break;
        default:
          params.where['name'] = req.query.text;
          break;  
      }

      const learnData = await this.LearnsModel.findAll(params);
      const learns = [];
      res.set({ 'content-type': 'text/html; charset=utf-8' });
      learnData.forEach(async (row, index) => {
        console.log();
        learns.push(
          `<h3>${index + 1}. ${this.createListItem(row.get('learn'))}</h3>`
        );
      });
      res.send(learns.join(''));
    });
  }

  createListItem(learn) {
    if (learn[0] === '<') {
      learn = learn.replace('<', '');
      learn = learn.replace('>', '');
      if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(learn)) {
        return `<a href=${learn}>${learn}</a><br/><img src="${learn}" width=200/>`;
      }

      return `<a href=${learn} />`;
    }
    return learn;
  }

  async getLearns(data) {
    const ip = await publicIp.v4();
    await this.bot.postMessage(
      data.channel,
      `http://${ip}?text=${data.user_text || "allText"}`
    );
  }
};
