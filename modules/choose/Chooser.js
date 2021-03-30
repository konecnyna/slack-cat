'use strict';

module.exports = class Chooser {
  /**
   * This will throw if it's in a locked channel.
   */
  async chooseRandomUser(bot, channel) {
    const members = await bot.getChannelMembers(channel)
    const nonBotMembers = members.filter(it => {
      return it !== bot.botInfo.id
    })

    if (!nonBotMembers) {
      return false
    }

    const randUser = this.getRandomUser(nonBotMembers);
    return randUser;
  }

  getRandomUser(members) {
    return members[Math.floor(Math.random() * members.length)];
  }
};
