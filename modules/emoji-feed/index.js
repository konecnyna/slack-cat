
'use strict';
const CHANNEL = config.getKey('emoji_feed_channel')

const { emojiFeedUtil } = require('./emoji-feed-util');
const CronJob = require('cron').CronJob

module.exports = class EmojiFeed extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    new CronJob(
      "00 20 16 * * *",
      () => {
        this.cron()
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

    if (data.args.includes('--force')) {
      await this.cron();
    }
  }

  async cron() {
    const list = await emojiFeedUtil.checkNewEmojis(this.table)
    if (list.length) {
      this.postNewEmojis(CHANNEL, list)
    }
  }

  async handleNewEmojis(data) {
    const newEmojis = await emojiFeedUtil.newEmojis(this.db, this.table)
    if (newEmojis.length) {
      this.postNewEmojis(data.channel, newEmojis)
      return;
    }

    this.bot.postRawMessage(data.channel, {
      attachments: [
        {
          title: 'No new emojis. :disappointed:',
          color: "#9C27B0",
          fields: [],
          footer: `See the feed <#${CHANNEL}>`,
        },
      ],
    });
  }

  async postNewEmojis(channel, list) {
    const fields = list.map(key => {
      return {
        value: `:${key}: ${key}`,
        short: false
      }
    })

    this.bot.postRawMessage(channel, {
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
