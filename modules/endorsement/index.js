'use strict';

module.exports = class Endorsements extends BaseStorageModule {


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


    const error = await this.endorseUser(data);
    if (!error) {
      this.bot.postMessage(
        data.channel,
        `You forgot to tell me who to endorse!\n${this.help()}`
      );
      return;
    }

    this.bot.postMessageToThread(data.channel, "Endorsed!", data.ts);
  }

  async handleEndorsements(data) {
    let group = this.getUserPatternRegex().exec(data.user_text);
    if (!group || data.user === group[1]) {
      return false;
    }

    const displayName = await this.bot.getUserNameDisplayNameFromId(group[1])

    const endorsementRows = await this.findAll(group[1]);
    const usersEndorsements = endorsementRows.map(endorsement => {
      return endorsement.get('endorsement')
    });

    return `*${displayName}* has been endorsed for:\n${usersEndorsements.join("; ")}`;
  }

  async endorseUser(data) {
    const pattern = this.getUserPatternRegex();
    let group = pattern.exec(data.user_text);
    if (!group) {
      return false;
    }

    const userArray = [];
    let sanitizedEndorsement = data.user_text
    while (group) {
      userArray.push(group[1]);
      sanitizedEndorsement = sanitizedEndorsement.replace(group[0], '');
      // Loop
      group = pattern.exec(data.user_text)
    }

    for (let i = 0; i < userArray.length; i++) {
      await this.addEndorsement(userArray[i], sanitizedEndorsement.trim(), data.user);
    }

    return true;
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
    return ['endorse', 'endorsements'];
  }

  getType() {
    return [BaseModule.TYPES.MODULE];
  }
};
