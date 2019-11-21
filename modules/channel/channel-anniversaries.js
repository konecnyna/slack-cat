const moment = require('moment');

module.exports = class ChannelAnniversaries {
  constructor(web) {
    this.web = web;
  }

  async getAnniversaries() {
    const { channels } = await this.web.channels.list();
    return channels.filter(channel => {
      return this.isDateAYearToday(channel)
    });
  }

  isDateAYearToday(channel) {
    const days = moment().diff(channel.created * 1000, 'day');
    channel['years_old'] = parseInt(days / 365);
    return days % 365 === 0;
  }

  async getChannelAnniversary(channelId) {
    const { channel } = await this.web.channels.info({ channel: channelId })
    const days = moment().diff(channel.created * 1000, 'day');
    return {
      date: moment(channel.created * 1000).format("MMMM DD YYYY"),
      days_til_anniversary: 365 - (600 % 365)
    };
  }
}