'use strict';
const Chooser = require('./Chooser');
const chooser = new Chooser();

module.exports = class Choose extends BaseModule {
  async handle(data) {
    try {
      const match = data.user_text.match(/\^(?<id>.*)\|/)
      let randUser;
      if (match) {
        const groupInfo = await this.bot.workSpace.usergroups.users.list({
          usergroup: match.groups.id
        });
        randUser = chooser.getRandomUser(groupInfo.users);
      } else {
        randUser = await chooser.chooseRandomUser(this.bot, data.channel);
      }
      this.bot.postMessage(data.channel, `<@${randUser}>`);
    } catch (e) {
      this.bot.postMessage(
        data.channel,
        `${e.message}, ya bozo.`
      );
    }
  }

  help() {
    return "Usage: `?choose` will post a random person's name from the channel.";
  }
};
