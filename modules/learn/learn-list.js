'use strict';
const publicIp = require('public-ip');

module.exports = class LearnsList {
  constructor(bot, model) {
    this.bot = bot;
    this.LearnsModel = model;
  }

  async createRoutes(app) {
    app.get('/learns', async (req, res) => {
      const params = {
        where: {},
        order: [['name', 'ASC']],
      };

      if (!req.query.text) {
        params.where['learn_type'] = 'quote';
      } else {
        params.where['name'] = req.query.text;
      }

      const learnData = await this.LearnsModel.findAll(params);
      const page = await this.createPage(res, learnData);
      res.send(page);
    });
  }

  async createPage(res, learnData) {
    res.set({ 'content-type': 'text/html; charset=utf-8' });

    const page = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
</head>
<body style="background: #EFEFEF">

<div class="container" class="p-3">
<h1> Learns: </h1>
<hr/>
${await this.createBody(learnData)}
</div>

</body>
</html>`;
    return page;
  }

  async createBody(learnData) {
    const cards = [];
    let learns = [];
    let title = null;

    learnData.forEach(async (row, index) => {
      if (title === null) {
        title = row.get('name');
      }

      if (title !== row.get('name')) {
        // New section.
        cards.push(this.createCard(title, learns));
        title = row.get('name');
        learns = [];
      }

      learns.push(
        `<div class="mt-2 mb-2">${learns.length + 1} - ${this.createListItem(
          row.get('learn')
        )}</div>`
      );
    });

    if (cards.length === 0) {
      cards.push(this.createCard(title, learns));
    }

    return cards.join('');
  }

  createCard(title, learns) {
    return `
    <div class="card p-3 mt-3">
        <h5 class="card-title">${title}</h5>
      <div class="card-body">
        ${learns.join('')}
      </div>
    </div>
    `;
  }

  createListItem(learn) {
    learn = learn.replace('<', '');
    learn = learn.replace('>', '');

    if (/\.(gif|jpg|jpeg|tiff|png)/i.test(learn)) {      
      return `<a href="${learn}" target="_blank"><img src="${learn}" width=200/></a>`;      
    }

    if (/(www|http:|https:)+[^\s]+[\w]/i.test(learn)) {      
      return `<a href="${learn}" target="_blank">${learn}</a>`;
    }

    if (learn.length === 0) {
      learn = "NO TEXT - THIS IS A BAD ENTRY.";
    }
    return learn;
  }

  async getLearns(data) {
    const ip = await publicIp.v4();
    const args = data.user_text ? `?text=${data.user_text}` : '';
    await this.bot.postMessage(
      data.channel,
      `http://${ip}:${config.getKey('port') || 3000}${args}`
    );
  }
};
