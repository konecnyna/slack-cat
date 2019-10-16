'use strict';

const userPattern = new RegExp(/\<@([^\s|\<]+)\>/, 'g');
const RoyaltyHelper = require('./royalty-helper.js');

module.exports = class Plus extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    this.royaltyHelper = new RoyaltyHelper(this);
  }

  async handle(data) {
    if (data.cmd === 'royalty' && !data.user_text) {

      this.royaltyHelper.displayFullCourtBoard(data);
      return
    }

    if (!data.user_text) {
      await this.bot.postMessageToThread(data.channel, `Anoint whom?`, data.ts);
      return;
    }

    const matches = data.user_text.match(userPattern);
    if (data.cmd === 'royalty') {
      this.displayTitleForUser(data, matches);
      return;
    }

    if (data.cmd === 'anoint') {
      this.anointUser(data, matches);
    }
  }

  async annotatedPostToChannel(channel, message) {
    this.bot.postMessageWithParams(channel, message, {
      icon_emoji: ':royalcat:',
      username: 'RoyalCat'
    })
  }

  async displayTitleForUser(data, matches) {
    const userName = await this.getUserNameFromId(matches[0]);
    const memberNameAndTitle = await this.royaltyHelper.displayTitleForUser(userName);
    this.annotatedPostToChannel(data.channel, `${memberNameAndTitle}`)
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

    const userName = await this.getUserNameFromId(matches[0]);
    const title = data.user_text.replace(matches[0], "").trim();
    const newCourtMember = await this.royaltyHelper.anointUser(userName, title);
    await this.annotatedPostToChannel(data.channel, `Hear Ye Hear Ye, ${matches[0]} is now *${newCourtMember}*!`);
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
