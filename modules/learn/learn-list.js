'use strict';

module.exports = class LearnsList {
  constructor(bot, model) {
    this.bot = bot;
    this.LearnsModel = model;
  }

  async createRoutes(app) {
    app.get('/', async (req, res) => {
      const params = {
        where: {
          name: req.query.text,
        },
      };

      const learnData = await this.LearnsModel.findAll(params);     
      const learns = [];

      learnData.forEach(async (row, index) => {
      	learns.push(`<h3>${index + 1}. ${row.get('learn')}</h3>`);
      });
      res.send(learns.join(''));
    });
  }

  async getLearns(data) {
    await this.bot.postMessage(
      data.channel,
      `http://104.131.78.3.com?text=${data.user_text}`
    );
  }
};
