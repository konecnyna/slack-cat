'use strict';
const PlusHelper = require("../plus/plus-helper");

//TODO: cleanup 
module.exports = class Endorsements extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    this.plusHelper = new PlusHelper(this);
  }

  async handle(data) {
    if (data.cmd.includes('endorsements')) {
      const msg = await this.handleEndorsements(data);
      this.bot.postMessageToThread(
        data.channel,
        msg || 'You forgot to give me a person starting with @slackname',
        data.ts
      );
      return;
    }

    if (!data.user_text) {
      this.bot.postMessage(data.channel, this.help())
      return;
    }

    const msgs = await this.endorseUser(data);
    if (!msgs) {
      this.bot.postMessage(
        data.channel,
        `You forgot to tell me who to endorse!\n${this.help()}`
      );
      return;
    }

    if (msgs.length === 0) {
      this.bot.postMessageToThread(data.channel, "Endorsed!", data.ts);
      return;
    }

    this.bot.postMessageToThread(data.channel, msgs.join("\n"), data.ts);
  }

  async plusUser(userId) {
    const name = await this.bot.getUserNameDisplayNameFromId(userId)
    const pluses = await this.plusHelper.plusUser(name);
    return `*${name}* has been endorsed and now has *${pluses} pluses*`;
  }

  async handleEndorsements(data) {
    let group = this.getUserPatternRegex().exec(data.user_text);
    if (!group) {
      return false;
    }

    const displayName = await this.bot.getUserNameDisplayNameFromId(group[1])

    const endorsementRows = await this.findAll(group[1]);
    const usersEndorsements = endorsementRows.map(endorsement => {
      return endorsement.get('endorsement')
    });

    return `*${displayName} has been endorsed for:*\n${usersEndorsements.join("; ")}`;
  }

  async endorseUser(data) {
    const pattern = this.getUserPatternRegex();
    let group = pattern.exec(data.user_text);
    if (!group) {
      return null;
    }

    const userArray = [];
    let sanitizedEndorsement = data.user_text
    while (group) {
      if (group[1] != data.user) {
        userArray.push(group[1]);
      }
      sanitizedEndorsement = sanitizedEndorsement.replace(group[0], '').trim();
      // Loop
      group = pattern.exec(data.user_text)
    }

    if (!sanitizedEndorsement || !sanitizedEndorsement.length) {
      return null;
    }

    const msgs = [];
    for (let i = 0; i < userArray.length; i++) {
      await this.addEndorsement(userArray[i], sanitizedEndorsement.trim(), data.user);
      msgs.push(await this.plusUser(userArray[i]));
    }

    return msgs;
  }

  async addEndorsement(userId, endorsement, endorserId) {
    const exists = await this.Endorsements.findOne({
      where: {
        userId: userId,
        endorsement: endorsement
      }
    });

    if (exists) {
      return;
    }

    return await this.Endorsements.create({
      userId: userId,
      endorsement: endorsement,
      endorserId: endorserId
    });
  }

  async findAll(userId) {
    return await this.Endorsements.findAll({
      where: {
        userId: userId,
      },
    });
  }

  getUserPatternRegex() {
    return new RegExp(/\<@([^\s|\<]+)\>/, 'g');
  }
  help() {
    return 'Endorse ppl for doing cool stuff! Usage:\n?endorse @username for doing kewl stuff.';
  }

  registerSqliteModel() {
    this.Endorsements = this.db.define('endorsements', {
      userId: { type: this.Sequelize.STRING, primaryKey: true },
      endorsement: { type: this.Sequelize.STRING, primaryKey: true }, // Don't dupe endorsements.
      endorserId: this.Sequelize.STRING
    });
  }

  aliases() {
    return ['endorse', 'endorse+', 'endorsements'];
  }

  getType() {
    return [BaseModule.TYPES.MODULE];
  }
};
