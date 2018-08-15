'use strict';

module.exports = class Chooser {
  /**
   * This will throw if it's in a locked channel.
   */
  async chooseRandomUser(bot, channel) {
    const channelData = await bot.getChannelById(data.channel);
    if (!channelData.members) {
      return false;
    }

    const randUser = this.getRandomUser(channelData.members);
    return randUser;
  }

  getRandomUser(members) {
    return members[Math.floor(Math.random() * members.length)];
  }
};
