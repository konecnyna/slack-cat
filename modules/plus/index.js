'use strict';

const util = require('util');
const userPattern = new RegExp(/\<@([^\s]+)\>/, 'g');
// const userPattern = new RegExp(/\<@(.*.)\>/, 'g');

const PlusHelper = require('./plus-helper.js');
const cache = require('memory-cache');

module.exports = class Plus extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    this.plusHelper = new PlusHelper(this);
  }

  async handle(data) {
    if (data.cmd === '--') {
      this.plusHelper.displayBeingMeanMsg(data);
      return;
    }

    if (data.cmd === 'leaderboard') {
      this.plusHelper.displayLeaderBoard(data);
      return;
    }

    if (!data.user_text) {
      return;
    }

    const matches = data.user_text.match(userPattern);
    if (data.cmd === 'pluses') {
      this.getUserPluses(data, matches);
      return;
    }

    this.plusUser(data, matches);
  }

  async getUserPluses(data, matches) {
    let user = data.user_text;
    if (matches && matches.length > 1) {
      user = await this.getUserNameFromId(matches[1]);
    }

    const pluses = await this.plusHelper.displayPlusesForUser(user);
    this.bot.postMessage(
      data.channel,
      `${data.user_text} has ${pluses} pluses!`
    );
  }

  async plusUser(data, matches) {    
    if ((matches && data.user === matches[1]) || data.user === data.user_text) {
      // Person is being an ahole and trying to plus themselves!
      this.bot.postMessage(data.channel, "You'll go blind like that kid!");
      return;
    }

    if (!matches) {
      // No user was refs so plus the raw text.]
      const pluses = await this.plusHelper.plusUser(
        data.user_text.toLowerCase()
      );
      this.bot.postMessage(
        data.channel,
        `${data.user_text} now has ${pluses} pluses!`
      );
      return;
    }

    // Resolve slack handle.
    try {
      let group;
      while (group = userPattern.exec(data.user_text)) {
        const userName = await this.getUserNameFromId(group[1]);
        const pluses = await this.plusHelper.plusUser(userName);
        await this.bot.postMessage(
          data.channel,
          `${userName} now has ${pluses} pluses!`
        );  
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

  async handleReaction(data) {
    if (
      data.reaction === 'eggplant' &&
      cache.get(this.getPlusKey(data)) === null
    ) {
      cache.put(this.getPlusKey(data), '', 5 * 60 * 1000, () => {});
      this.bot.postMessageToThread(
        data.item.channel,
        '( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)',
        data.item.ts,
        {}
      );
      return;
    }

    if (data.reaction !== 'heavy_plus_sign' || !data.item_user) {
      return;
    }

    if (cache.get(this.getPlusKey(data)) != null) {
      // try to dup pluses
      return;
    }

    const userName = await this.bot.getUserNameFromId(data.item_user);
    const user = userName.user.profile.display_name || userName.user.name;
    const pluses = await this.plusHelper.plusUser(user);
    cache.put(this.getPlusKey(data), '', 5 * 60 * 1000, () => {});

    const msg = `${user} now has ${pluses} pluses!`;
    this.bot.postMessageToThread(data.item.channel, msg, data.item.ts);
  }

  getPlusKey(data) {
    return `${data.item_user}${data.item.ts}${data.user}${data.item.channel}${
      data.item.reaction
    }`;
  }

  help() {
    return 'Show people love <3 by plusing them!';
  }

  registerSqliteModel() {
    this.PlusModel = this.db.define('pluses', {
      name: { type: this.Sequelize.STRING, primaryKey: true },
      pluses: this.Sequelize.INTEGER,
    });
  }

  aliases() {
    return ['++', '+', 'pluses', '--', 'leaderboard', 'kudos'];
  }

  getType() {
    return [BaseModule.TYPES.MODULE, BaseModule.TYPES.REACTION];
  }

  postErrorMessage(data) {
    this.bot.postMessage(data.channel, 'Something went wrong...');
  }
};
