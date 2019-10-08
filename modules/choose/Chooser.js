'use strict';

module.exports = class Chooser {
  /**
   * This will throw if it's in a locked channel.
   */
  async chooseRandomUser(bot, channel) {
    const channelData = await bot.getChannelById(channel)
    const members = channelData.members.filter(it => {
      return it !== this.bot.botInfo.id
    })

    if (!members) {
      return false
    }

    const randUser = this.getRandomUser(channelData.members);
    return randUser;
  }

  getRandomUser(members) {
    return members[Math.floor(Math.random() * members.length)];
  }
};
