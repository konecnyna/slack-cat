
'use strict';
const request = require('request-promise');
const token = config.getKey('slack_access_token_oauth')
const CronJob = require('cron').CronJob



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

  }

  checkNewEmojis() {
    const response = await request(`https://slack.com/api/emoji.list?token=${token}`);
    const { emoji } = JSON.parse(response);

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
          value: emoji[key]
        })
      }
    })

    await Promise.all(promises)
    if (newList.length) {
      this.postNewEmojis(newList)
    }
  }

  postNewEmojis(list) {

  }

  registerSqliteModel() {
    this.EmojiFeed = this.db.define('emoji_feed', {
      key: { type: this.Sequelize.STRING, primaryKey: true },
      value: this.Sequelize.STRING
    });
  }


  help() {
    return 'The bot should respond with pong. For debugging purposes';
  }
};
