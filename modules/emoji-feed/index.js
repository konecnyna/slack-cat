
'use strict';
const request = require('request-promise');
const token = config.getKey('slack_access_token_oauth')
const CronJob = require('cron').CronJob

const CHANNEL = "CV689JSKF";
module.exports = class EmojiFeed extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    new CronJob(
      "00 20 16 * * *",
      () => {
        this.checkNewEmojis()
      },
      null,
      true,
      'America/New_York'
    )
  }

  async handle(data) {
    this.checkNewEmojis()
  }

  async checkNewEmojis() {
    const { emoji } = await request(`https://slack.com/api/emoji.list?token=${token}`, {
      json: true
    });

    const newList = [];

    const promises = Object.keys(emoji).map(async key => {
      const result = await this.EmojiFeed.findOne({
        where: {
          key: key,
        },
      });

      if (!result) {
        newList.push(key)
        return this.EmojiFeed.create({
          key: key,
          value: emoji[key],
          date_added: new Date()
        })
      }
    })

    await Promise.all(promises)
    console.log(newList)
    if (newList.length) {
      this.postNewEmojis(newList)
    }
  }

  async postNewEmojis(list) {
    const fields = list.map(key => {
      return {
        value: `${key} - :${key}:`,
        short: true
      }
    })

    this.bot.postRawMessage(CHANNEL, {
      attachments: [
        {
          title: 'New emojis:',
          color: "#9C27B0",
          fields: fields,
        },
      ],
    });
  }

  registerSqliteModel() {
    this.EmojiFeed = this.db.define('emoji_feed', {
      key: { type: this.Sequelize.STRING, primaryKey: true },
      value: this.Sequelize.STRING,
      date_added: this.Sequelize.DATE
    }, { timestamps: false });
  }


  help() {
    return 'The bot should respond with pong. For debugging purposes';
  }
};
