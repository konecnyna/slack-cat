'use strict';
const CronJob = require('cron').CronJob
const ChannelAnniversaries = require('./channel-anniversaries');

module.exports = class Channel extends BaseModule {
  constructor(bot) {
    super(bot);
    this.anniversaries = new ChannelAnniversaries(bot.web);
    new CronJob(
      "00 45 7 * * *",
      () => {
        this.checkChannelAnniversaries()
      },
      null,
      true,
      'America/New_York'
    )
  }

  async handle(data) {
    if (data.cmd.includes('anniversary')) {
      return this.getChannelAnniversary(data.channel);
    }

    this.bot.postMessage(
      data.channel,
      `This channel's id is: \`${data.channel}\``
    );
  }

  async checkChannelAnniversaries() {
    const channels = await this.anniversaries.getAnniversaries()
    channels.map(channel => {
      this.sendAnniversaryMsg(channel.id, channel.years_old)
    })
  }

  async getChannelAnniversary(channelId) {
    const data = await this.anniversaries.getChannelAnniversary(channelId);
    this.postMessage(channelId, `This channel was created on ${data.date}.\n\nIt's anniversary is ${data.days_til_anniversary} days away!`);
  }

  async sendAnniversaryMsg(channelId, diff) {
    let msg = ""
    if (diff > 1) {
      msg = `This channel is ${diff} years old today. \n\nHappy anniversary y'all!\n:birthday: :confetti_ball: :gift: :confetti_ball: :birthday:`
    } else {
      msg = "This channel is 1 year older today. \n\nHappy anniversary y'all!\n:birthday: :confetti_ball: :gift: :confetti_ball: :birthday:";
    }

    this.postMessage(channelId, msg);
  }

  postMessage(channelId, msg) {
    this.bot.postRawMessage(channelId, {
      icon_emoji: ':birthday:',
      username: 'AnniversaryCat',
      attachments: [
        {
          color: '#FEB3DD',
          author_name: msg,
        }
      ]
    })
  }

  aliases() {
    return ['anniversary'];
  }

  help() {
    return 'Get current channels id';
  }
};
