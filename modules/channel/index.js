'use strict';
const CronJob = require('cron').CronJob
const ChannelAnniversaries = require('./channel-anniversaries');

module.exports = class Channel extends BaseModule {
  constructor(bot) {
    super(bot);
    this.anniversaries = new ChannelAnniversaries(bot.web);
    new CronJob(
      "00 45 9 * * *",
      () => {
        this.checkChannelAnniversaries(false, {})
      },
      null,
      true,
      'America/New_York'
    )
  }

  async handle(data) {
    if (data.args.includes('--debug')) {
      this.sendAnniversaryMsg(data.channel)
      return;
    }

    this.bot.postMessage(
      data.channel,
      `This channel's id is: \`${data.channel}\``
    );
  }

  async checkChannelAnniversaries(isDebug, data) {
    const channels = await this.anniversaries.getAnniversaries()
    channels.map(channel => {
      this.sendAnniversaryMsg(isDebug ? data.channel : channel.id)
    })
  }

  async sendAnniversaryMsg(channelId) {
    this.bot.postRawMessage(channelId, {
      icon_emoji: ':birthday:',
      username: 'AnniversaryCat',
      attachments: [
        {
          color: '#FEB3DD',
          author_name: "Congratulations. This channel is 1 year older today. \n\nHappy Birthday Y'all!\n:birthday: :confetti_ball: :gift: :confetti_ball: :birthday:",
        }
      ]
    })
  }
  help() {
    return 'Get current channels id';
  }
};
