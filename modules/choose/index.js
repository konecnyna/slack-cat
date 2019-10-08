'use strict';
const Chooser = require('./Chooser');
const chooser = new Chooser();

module.exports = class Choose extends BaseModule {
  async handle(data) {
    try {
      const randUser = await chooser.chooseRandomUser(this.bot, data.channel);
      const name = await this.bot.resolveUserNameFromId(randUser);
      this.bot.postMessage(data.channel, name);
    } catch (e) {
      console.log(e, data);
      this.bot.postMessage(
        data.channel,
        "Couldn't find anyone. Is this a private channel? If so I can't see the user list, ya bozo."
      );
    }
  }

  help() {
    return "Usage: `?choose` will post a random person's name from the channel.";
  }
};
