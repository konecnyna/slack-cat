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
      const diff = moment().diff(channel.created * 1000, 'years')
      this.sendAnniversaryMsg(isDebug ? data.channel : channel.id, diff)
    })
  }

  async sendAnniversaryMsg(channelId, diff) {
    let msg = ""
    if (diff > 1) {
      msg = `Congratulations. This channel is ${diff} years old today. \n\nHappy Birthday Y'all!\n:birthday: :confetti_ball: :gift: :confetti_ball: :birthday:`
    } else {
      msg = "Congratulations. This channel is 1 year older today. \n\nHappy Birthday Y'all!\n:birthday: :confetti_ball: :gift: :confetti_ball: :birthday:";
    }

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
  help() {
    return 'Get current channels id';
  }
};
