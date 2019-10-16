'use strict';

const userPattern = new RegExp(/\<@([^\s|\<]+)\>/, 'g');
const RoyaltyHelper = require('./royalty-helper.js');

module.exports = class Plus extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    this.royaltyHelper = new RoyaltyHelper(this);
  }

  async handle(data) {
    if (data.cmd === 'royalty') {
      if (!data.user_text) {
        this.royaltyHelper.displayFullCourtBoard(data);
        return
      }
      const matches = data.user_text.match(userPattern);
      this.displayTitleForUser(data, matches);
      return;
    }

    if (!data.user_text) {
      await this.bot.postMessageToThread(data.channel, `Anoint whom?`, data.ts);
      return;
    }

    const matches = data.user_text.match(userPattern);
    if (data.cmd === 'anoint') {
      this.anointUser(data, matches);
    }
  }

  async displayTitleForUser(data, matches) {
    let user = data.user_text;
    if (matches && matches.length > 1) {
      user = await this.getUserNameFromId(matches[1]);
    }

    const memberNameAndTitle = await this.royaltyHelper.displayTitleForUser(user);
    this.bot.postMessage(data.channel, `${memberNameAndTitle}`);
  }

  hacker(data) {
    if (data.user === data.user_text) {
      return true;
    }

    let group;
    while (group = userPattern.exec(data.user_text)) {
      if (group && data.user === group[1]) {
        return true;
      }
    }
  }

  async anointUser(data, matches) {
    console.log("anoint " + data + ", " + matches);
    if (this.hacker(data)) {
      // Person is being an ahole and trying to anoint themselves!
      this.bot.postMessageToThread(data.channel, "You can not choose your destiny, only make the best of it", data.item.ts);
      return;
    }

    if (!matches) {
      // No user was refs so skip
      this.bot.postMessageToThread(data.channel, `I will not anoint a thing such as ${data.user_text}. I will only anoint \`@SomeOneICanAt\`.`, data.ts);
      return;
    }

    try {
      let group;
      const map = {};

      while (group = userPattern.exec(data.user_text)) {
        if (!map[group[1]]) {
          map[group[1]] = 1;
        } else {
          map[group[1]] = map[group[1]] + 1;
        }


        // prevent spam.
        if (map[group[1]] > 3) {
          return;
        }

        const userName = await this.getUserNameFromId(group[1]);
        const title = data.user_text.replace(group[0], "").trim();
        const newCourtMember = await this.royaltyHelper.anointUser(userName, title);
        await this.bot.postMessage(data.channel, `Hear Ye Hear Ye, ${group[0]} is now *${newCourtMember}*!`);
      }
    } catch (e) {
      console.error(e);
      this.postErrorMessage(data);
    }
  }

  async getUserNameFromId(userPatternResult) {
    const userData = await this.bot.getUserNameFromId(userPatternResult);
    return userData.user.profile.display_name || userData.user.name;
  }

  help() {
    return 'The Royal Slack Court. ?anoint new members, ?royalty to see the full court, ?royalty `<@someone>` to see their position.';
  }

  aliases() {
    return ['anoint'];
  }

  async registerSqliteModel() {
    this.RoyaltyModel = this.db.define('royalties', {
      name: { type: this.Sequelize.STRING, primaryKey: true },
      title: this.Sequelize.STRING
    });
  }

  getType() {
    return [BaseModule.TYPES.MODULE];
  }

  postErrorMessage(data) {
    this.bot.postMessageToThread(data.channel, 'Something went wrong...', data.ts || data.item.ts);
  }
};
