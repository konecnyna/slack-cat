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
    this.bot.postMessage(
      data.channel,
      `This channel's id is: \`${data.channel}\``
    );
  }

  async checkChannelAnniversaries() {
    const channels = await this.anniversaries.getAnniversaries()
    channels.map(channel => {
      const diff = moment().diff(channel.created * 1000, 'years')
      this.sendAnniversaryMsg(channel.id, diff)
    })
  }

  async getChannelAnniversary(channelId) {
    const msg = await this.anniversaries.getChannelAnniversary(channelId);
    this.postMessage(channelId, msg);
  }

  async sendAnniversaryMsg(channelId, diff) {
    let msg = ""
    if (diff > 1) {
      msg = `Congratulations. This channel is ${diff} years old today. \n\nHappy anniversary y'all!\n:birthday: :confetti_ball: :gift: :confetti_ball: :birthday:`
    } else {
      msg = "Congratulations. This channel is 1 year older today. \n\nHappy anniversary y'all!\n:birthday: :confetti_ball: :gift: :confetti_ball: :birthday:";
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
