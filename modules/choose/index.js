'use strict';

module.exports = class Choose extends BaseModule {
  async handle(data) {
    try {
      const userData = await this.bot.getChannelById(data.channel);
      const randUser = this.getRandomUser(userData);
      const name = await this.bot.resolveUserNameFromId(randUser);
      this.bot.postMessage(data.channel, name);
    } catch (e) {
      console.log(e);
      this.bot.postMessage(
        data.channel,
        "Couldn't find anyone. Is this a private channel? If so I can't see the user list, ya bozo."
      );
    }
  }

  getRandomUser(userData) {
    return userData.members[
      Math.floor(Math.random() * userData.members.length)
    ];
  }

  help() {
    return "Usage: `?choose` will post a random person's name from the channel.";
  }
};
