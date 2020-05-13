
'use strict';
const request = require('request-promise');
const token = config.getKey('slack_access_token_oauth')

const { emojiFeedUtil } = require('./emoji-feed-util');
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
    if (data.cmd === 'new-emojis') {
      this.handleNewEmojis(data);
      return;
    }

    const list = await emojiFeedUtil.checkNewEmojis()
    if (newList.length) {
      this.postNewEmojis(list)
    }
  }

  async handleNewEmojis(data) {
    const newEmojis = await emojiFeedUtil.newEmojis(this.db, this.table)
    if (newEmojis.length) {
      this.postNewEmojis(newEmojis)
      return;
    }

    this.bot.postRawMessage(data.channel, {
      attachments: [
        {
          title: 'No new emojis. :disappointed:',
          color: "#9C27B0",
          fields: [],
        },
      ],
    });
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
    this.table = this.db.define('emoji_feed', {
      key: { type: this.Sequelize.STRING, primaryKey: true },
      value: this.Sequelize.STRING,
      date_added: this.Sequelize.DATE
    }, { timestamps: false });
  }


  help() {
    return 'The bot should respond with pong. For debugging purposes';
  }


  aliases() {
    return ['new-emojis'];
  }
};
