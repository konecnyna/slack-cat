'use strict';
const Chooser = require('./Chooser');
const chooser = new Chooser();

module.exports = class Choose extends BaseModule {
  async handle(data) {
    try {
      const match = data.user_text.match(new RegExp(/^(?<id>.*)|/))
      let randUser;
      if (match) {
        const groupInfo = await this.workSpace.web.usergroups.users.list("SD3D3KYLF")
        randUser = chooser.getRandomUser(groupInfo.users);
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
