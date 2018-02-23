'use strict';

const util = require('util');
const userPattern = new RegExp(/\<@(.*.)\>/, 'i');
const PlusHelper = require('./plus-helper.js');

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

    if (data.cmd === 'pluses') {
      this.plusHelper.displayPlusesForUser(data);
      return;
    }

    if (data.cmd === 'leaderboard') {
      this.plusHelper.displayLeaderBoard(data);
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
        userData.user.display_name
          ? userData.user.display_name
          : userData.user.name
      );
    } catch (e) {
      console.error(e);
      this.postErrorMessage(data);
    }
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
    return ['++', '+', 'pluses', '--', 'leaderboard'];
  }

  postErrorMessage(data) {
    this.bot.postMessage(data.channel, 'Something went wrong...');
  }
};
