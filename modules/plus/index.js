'use strict';

const userPattern = new RegExp(/\<@([^\s|\<]+)\>/, 'g');
const PlusHelper = require('./plus-helper.js');
const cache = require('memory-cache');


const SPAM_KEY = "spamalot";

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
    this.bot.postMessageToThread(
      data.channel,
      `${data.user_text} has ${pluses} pluses!`,
      data.ts
    );
  }

  hacker(data) {
    if (data.user === data.user_text) {
      return true;
    }


    let group;
    while (group = userPattern.exec(data.user_text)) {
      if (group && data.user === group[1] || data.user_text === group[1]) {
        return true;
      }
    }
  }

  async plusUser(data, matches) {
    if (this.hacker(data)) {
      // Person is being an ahole and trying to plus themselves!
      this.bot.postMessageToThread(data.channel, "You'll go blind like that kid!", data.ts);
      return;
    }

    if (!matches) {
      // No user was refs so plus the raw text.]
      const pluses = await this.plusHelper.plusUser(
        data.user_text.toLowerCase()
      );
      this.bot.postMessageToThread(
        data.channel,
        `${data.user_text} now has ${pluses} pluses!`,
        data.ts
      );
      return;
    }

    if (cache.get(this.getPlusKey(data)) != null) {
      await this.bot.postMessageToThread(data.channel, `Quit trying to spam.`, data.ts);
      return;
    }

    try {
      let group;
      const map = {};

      let plusMap = {}
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
        total = await this.plusHelper.plusUser(userName);
        plusMap[userName] = total;
      }

      Object.keys(plusMap).forEach(it => {
        total = plusMap[it];
        await this.bot.postMessageToThread(data.channel, `${it} now has ${total} pluses!`, data.ts);
      })

      cache.put(this.getPlusKey(data), '', 3 * 60 * 1000, () => { });
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
      cache.get(this.getReactionKey(data)) === null
    ) {
      cache.put(this.getReactionKey(data), '', 5 * 60 * 1000, () => { });
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

    this.plusUserFromReaction(data);
  }

  async plusUserFromReaction(data) {
    if (cache.get(this.getReactionKey(data)) != null) {
      // try to dup pluses
      return;
    }

    const userName = await this.bot.getUserNameFromId(data.item_user);
    const user = userName.user.profile.display_name || userName.user.name;
    if (data.user === data.item_user) {
      this.bot.postMessageToThread(data.item.channel, `Stop tryna hack ${user}`, data.item.ts);
      return;
    }

    const pluses = await this.plusHelper.plusUser(user);
    cache.put(this.getReactionKey(data), '', 5 * 60 * 1000, () => { });

    const msg = `${user} now has ${pluses} pluses!`;
    this.bot.postMessageToThread(data.item.channel, msg, data.item.ts);
  }


  getReactionKey(data) {
    return `${data.item_user}${data.item.ts}${data.user}${data.item.channel}${
      data.item.reaction
      }`;
  }

  getPlusKey(data) {
    return `${data.user_text}${data.user}${data.channel}`;
  }

  help() {
    return 'Show people love <3 by plusing them!';
  }

  async registerSqliteModel() {
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
    this.bot.postMessageToThread(data.channel, 'Something went wrong...', data.ts || data.item.ts);
  }
};
