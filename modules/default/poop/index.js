'use strict';

const util = require('util');
const botParams = {
  icon_emoji: ':poop:',
  username: 'PoopCat',
};

module.exports = class Poop extends BaseStorageModule {
  async handle(data) {
    const poopData = await this.updatePoop(data);

    const output = util.format(
      '*%s just pooped!* _%s pooped %d times_.\n Please lock your screen next time! http://osxdaily.com/2011/01/17/lock-screen-mac/ \n',
      poopData.user,
      poopData.user,
      poopData.poops
    );

    this.bot.postMessageWithParams(data.channel, output, botParams);
  }

  registerSqliteModel() {
    this.PoopModel = this.db.define('poops', {
      name: this.Sequelize.STRING,
      poops: {
        type: this.Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  }

  async updatePoop(data) {
    const user = await this.bot.getUserNameFromId(data.user);
    const userName = user.user.name;
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

  help() {
    return 'The bot should respond with pong. For debugging purposes';
  }
};
