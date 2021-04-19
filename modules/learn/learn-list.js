'use strict';
const publicIp = require('public-ip');
const request = require('request-promise');
const token = config.getKey('slack_access_token_oauth');

const ROUTE_PATH = 'learns';

module.exports = class LearnsList {
  constructor(bot, model) {
    this.bot = bot;
    this.LearnsModel = model;
  }

  async createRoutes(app) {
    app.get(`/${ROUTE_PATH}`, async (req, res) => {
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
    const { emoji } = await this.getEmojisList();
    this.emojiMap = emoji || {};

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
    if (!learnData || !learnData.length) {
      return `
      <div class="card p-3 mt-3">
      <h5 class="card-title">No results!</h5>
      <hr/ class="m-0 p-0">
      <div class="card-body" style="margin: auto">
        <img src="https://i.gifer.com/7VE.gif"/>
      </div>
    </div>
      `;
    }
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
        `<div class="mt-2 mb-2">${learns.length + 1}. ${this.createListItem(
          row.get('learn')
        )}<span style="float:right; font-size:16px" class="badge badge-primary">${row.get(
          'learned_by'
        )}</span></div>`
      );
    });

    if (cards.length === 0) {
      cards.push(this.createCard(title, learns));
    }

    return cards.join('');
  }

  async getEmojisList() {
    const response = await request(
      `https://slack.com/api/emoji.list?token=${token}`
    );
    return JSON.parse(response);
  }

  createCard(title, learns) {
    return `
    <div class="card p-3 mt-3">
      <h5 class="card-title">${this.makeTitle(title)}</h5>
      <hr/ class="m-0 p-0">
      <div class="card-body">
        ${learns.join('')}
      </div>
    </div>
    `;
  }

  makeTitle(title) {
    if (/:([\w-_]+):/g.test(title)) {
      return `${this.parseEmojiRegex(title)} (${title})`;
    }
    return title;
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

    if (/:([\w-_]+):/g.test(learn)) {
      return this.parseEmojiRegex(learn);
    }

    if (learn.length === 0) {
      learn = 'NO TEXT - THIS IS A BAD ENTRY.';
    }
    return learn;
  }

  parseEmojiRegex(learn) {
    let body = `<br>${learn.replace(/(?:\r\n|\r|\n)/g, '<br>')}`;

    const regexp = /:([\w-_]+):/g;
    const matches = learn.matchAll(regexp);

    for (const match of matches) {
      if (this.emojiMap[match[1]]) {
        body = body.replace(
          match[0],
          `<img src=${this.emojiMap[match[1]]} width="32"/>`
        );
      }
    }
    return body;
  }

  async getLearns(data) {
    const ip = config.getKey('host') || (await publicIp.v4());
    const user = await this.bot.getUserNameFromText(data.user_text);
    let args = data.user_text ? `?text=${data.user_text}` : '';
    if (user) {
      args = `?text=${user}`;
    }
    await this.bot.postMessage(
      data.channel,
      `http://${ip}/${ROUTE_PATH}${args}`
    );
  }
};
