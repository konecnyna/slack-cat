'use strict';
const Chooser = require('./Chooser');
const chooser = new Chooser();

module.exports = class Choose extends BaseModule {
  async handle(data) {
    try {
      const userArg = this.getUserArg(data);
      let randUser;
      if (userArg) {
        const groupInfo = await this.web.usergroups.user.list(userArg[0])
        randUser = chooser.getRandomUser(groupInfo.userss);
      } else {
        randUser = await chooser.chooseRandomUser(this.bot, data.channel);
      }
      this.bot.postMessage(data.channel, `<@${randUser}>`);
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
