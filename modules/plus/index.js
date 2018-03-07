'use strict';

const util = require('util');
const userPattern = new RegExp(/\<@(.*.)\>/, 'i');
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

    if (data.cmd === 'pluses') {
      this.plusHelper.displayPlusesForUser(data);
      return;
    }

    const matches = data.user_text.match(userPattern);
    if ((matches && data.user === matches[1]) || data.user === data.user_text) {
      // Person is being an ahole and trying to plus themselves!
      this.bot.postMessage(data.channel, "You'll go blind like that kid!");
      return;
    }

    if (!matches || matches.length < 2) {
      // No user was refs so plus the raw text.]
      this.plusHelper.plusUser(data.channel, data.user_text.toLowerCase());
      return;
    }

    // Resolve slack handle.
    try {
      const userData = await this.bot.getUserNameFromId(matches[1]);

      this.plusHelper.plusUser(
        data.channel,
        userData.user.profile.display_name || userData.user.name
      );
    } catch (e) {
      console.error(e);
      this.postErrorMessage(data);
    }
  }

  async handleReaction(data) {
    console.log('hi');
    if (data.reaction === 'eggplant') {
      this.bot.postMessage(data.item.channel, '( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)');
      return;
    }

    if (data.reaction !== 'heavy_plus_sign' || !data.item_user) {
      return;
    }
    
    if (cache.get(this.getPlusKey(data)) != null) {
      // try to dup pluses
      return;
    }
    console.log('bai');

    const userName = await this.bot.getUserNameFromId(data.item_user);
    this.plusUser(
      data.item.channel,
      userName.user.profile.display_name || userName.user.name
    );
    cache.put(this.getPlusKey(data), '', 5 * 60 * 1000, () => {});
  }

  getPlusKey(data) {
    return `${data.item_user}${data.user}${data.item.channel}${
      data.item.reaction
    }`;
  }

  plusUser(channel, userText) {
    this.plusHelper.plusUser(channel, userText);
  }

  help() {
    return 'Show people love <3 by plusing them!';
  }

  registerSqliteModel() {
    this.PlusModel = this.db.define('pluses', {
      name: this.Sequelize.STRING,
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
