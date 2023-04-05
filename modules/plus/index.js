'use strict';
const { handlePlus, handleEggplantReaction } = require("./reaction-handler");
const plusHandler = require("./plus-handler");

const userPattern = new RegExp(/\<@([^\s|\<]+)\>/, 'g');
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
    const pluses = await this.plusHelper.displayPlusesForUser(data.user);
    if (matches && matches.length > 1) {
      user = await this.getUserNameFromId(matches[1]);
    }
    this.bot.postMessageToThread(
      data.channel,
      `${data.user_text} has ${pluses} pluses!`,
      data.ts
    );
  }

  async plusUser(data, matches) {

    if (plusHandler.hacker(data)) {
      // Person is being an ahole and trying to plus themselves!
      this.bot.postMessageToThread(data.channel, "You'll go blind like that kid!", data.ts);
      return;
    }


    if (cache.get(this.getPlusKey(data)) != null) {
      await this.bot.postMessageToThread(data.channel, `Quit trying to spam.`, data.ts);
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
        const total = await this.plusHelper.plusUser(group[1]);
        if (!plusMap[userName]) {
          plusMap[userName] = {
            occurrences: 0
          }
        }
        plusMap[userName]['total'] = total;
        plusMap[userName].occurrences += 1;
        cache.put(this.getPlusKey(data), '', 3 * 60 * 1000, () => { });
      }

      const msgs = Object.keys(plusMap).map(it => {
        const user = plusMap[it];
        let occurrences = "";
        if (user.occurrences > 1) {
          occurrences = `(+${user.occurrences})`;
        }

        return `${it} now has ${user.total} pluses! ${occurrences}`
      });

      this.bot.postMessageToThread(data.channel, msgs.join("\n"), data.ts);
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
    if (data.reaction === 'eggplant' && cache.get(this.getReactionKey(data)) === null) {
      const msg = handleEggplantReaction(data);
      cache.put(this.getReactionKey(data), '', 5 * 60 * 1000, () => { });
      this.bot.postMessageToThread(
        data.item.channel,
        msg,
        data.item.ts,
        {}
      );
    }

    if (data.reaction === 'heavy_plus_sign') {
      const userName = await this.bot.getUserNameFromId(data.item_user);
      const msg = await handlePlus(data, userName, this.plusHelper);
      if (!msg) { return }
      this.bot.postMessageToThread(data.item.channel, msg, data.item.ts);
    }
  }

  getReactionKey(data) {
    return `${data.item_user}${data.item.ts}${data.user}${data.item.channel}${data.item.reaction
      }`;
  }

  getPlusKey(data) {
    const text = new Set(data.user_text.split(" "));
    const key = [...text].join("");
    return `${key}${data.user}${data.channel}`;
  }

  help() {
    return 'Show people love <3 by plusing them!';
  }

  async registerSqliteModel() {
    this.PlusModel = this.db.define('pluses', {
      name: { type: this.Sequelize.STRING, primaryKey: true },
      pluses: this.Sequelize.INTEGER,
    }, { timestamps: false });

    this.PlusModelNew = this.db.define('pluses_table', {
      slackid: { type: this.Sequelize.STRING, primaryKey: true },
      pluses: this.Sequelize.INTEGER,
    }, { timestamps: false });
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
