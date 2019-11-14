const moment = require('moment');

module.exports = class ChannelAnniversaries {
  constructor(web) {
    this.web = web;
  }

  async getAnniversaries() {
    const { channels } = await this.web.channels.list();
    return channels.filter(channel => {
      return channel.created
    });
  }

  isDateAYearToday(channel) {
    const years = moment().diff(channel.created * 1000, 'years');
    channel['year_old'] = years;
    return years === 1;
  }

  async getChannelAnniversary(channelId) {
    const { channel } = await this.web.channels.info({ channel: channelId })
    return moment(channel.created * 1000).format("MMMM DD");
  }
}