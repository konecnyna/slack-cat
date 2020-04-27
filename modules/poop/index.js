'use strict';

const botParams = {
  icon_emoji: ':poop:',
  username: 'PoopCat',
  blacklist: 'channels_blacklist',
};

const userPattern = new RegExp(/\<@(.*.)\>/, 'i');

module.exports = class Poop extends BaseStorageModule {
  async handle(data) {
    if (data.cmd === 'poop-board' || data.cmd === 'poopboard') {
      this.postLeaderBoard(data);
      return;
    }

    if (data.cmd === 'poops') {
      this.postUserPoops(data);
      return;
    }

    if (await this.isBlackListed(data.channel)) {
      this.denyPooping(data.channel);
      return;
    }

    this.updateAndPostPoop(data);
  }

  async denyPooping(channel) {
    const msg = `Not in this channel please!`;
    this.bot.postMessage(channel, msg);
  }

  async updateAndPostPoop(data) {
    const poopData = await this.updatePoop(data);
    let msg = `*${poopData.user} just got pooped!!!* ${poopData.user} pooped _${
      poopData.poops
      } times_.\nPlease lock your screen next time! http://osxdaily.com/2011/01/17/lock-screen-mac/\n`;
    if (poopData.poops === 1) {
      msg = `*${
        poopData.user
        }* got pooped for the first time. That's a big stink! Don't leave your computer unlocked when you're not with it! Side effects can include hacking, stealing, destruction, and...pooping (by one of your sneaky gremlin coworkers). http://osxdaily.com/2011/01/17/lock-screen-mac/`;
    }
    this.bot.postMessageWithParams(data.channel, msg, botParams);
  }

  registerSqliteModel() {
    this.PoopModel = this.db.define('poops', {
      name: { type: this.Sequelize.STRING, primaryKey: true },
      poops: {
        type: this.Sequelize.INTEGER,
        defaultValue: 0,
      },
    }, { timestamps: false });
  }

  async updatePoop(data) {
    const userName = await this.getUserName(data.user);
    const poop = await this.upsert(
      this.PoopModel,
      { where: { name: userName } },
      {
        name: userName,
        poops: 1,
      },
      {
        poops: this.db.literal('poops + 1'),
      }
    );

    return {
      user: userName,
      poops: poop.get('poops'),
    };
  }

  async getUserName(userId) {
    const user = await this.bot.getUserNameFromId(userId);
    return user.user.profile.display_name || user.user.name;
  }

  async postUserPoops(data) {
    let user = data.user_text;
    const matches = data.user_text.match(user);
    if (matches && matches.length > 1) {
      user = await this.getUserNameFromId(matches[1]);
    } else if (!user) {
      user = await this.getUserName(data.user);
    }

    const poopsRow = await this.PoopModel.findOne({
      where: {
        name: user,
      },
    });

    let msg = '';
    if (!poopsRow) {
      msg = `${user} has not been pooped... _yet_! :smirk: :poop: `;
    } else {
      const poops = poopsRow.get('poops');
      msg = `${user} has been pooped :poop: *_${poops} times_* :poop:`;
    }

    this.bot.postMessage(data.channel, msg);
  }

  async postLeaderBoard(data) {
    const poops = await this.PoopModel.findAll({
      order: [['poops', 'DESC']],
      limit: 10,
    });

    const fields = [];
    poops.forEach((plus, index) => {
      fields.push({
        title: `${index + 1}. ${plus.get('name')} (${plus.get('poops')} poops)`,
        short: false,
      });
    });

    this.bot.postRawMessage(data.channel, {
      icon_emoji: ':poop:',
      username: 'PoopBoard',
      attachments: [
        {
          color: '#795548',
          fields: fields,
        },
      ],
    });
  }

  isValidConfig() {
    return (
      config.getKey(botParams.blacklist) &&
      config.getKey(botParams.blacklist).poop
    );
  }

  aliases() {
    return ['poop-board', 'poopboard', ':poop:', 'poops'];
  }

  async isBlackListed(channel) {
    if (!this.isValidConfig()) {
      return;
    }

    const blacklisted = config.getKey(botParams.blacklist).poop;
    const currentChannel = await this.bot.getChannelById(channel);
    if (!blacklisted || !currentChannel) {
      return false;
    }

    return blacklisted.includes(currentChannel.name);
  }

  help() {
    return 'YOU JUST GOT POOPED!!! :poop:';
  }
};
