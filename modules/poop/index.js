'use strict';

const botParams = {
  icon_emoji: ':poop:',
  username: 'PoopCat',
};

module.exports = class Poop extends BaseStorageModule {
  async handle(data) {

    if (data.cmd === 'poop-board') {
      this.postLeaderBoard(data);
      return;
    }

    const poopData = await this.updatePoop(data);
    const msg = `${poopData.user} just pooped!* ${poopData.user} pooped ${poopData.poops} times_.\n Please lock your screen next time! http://osxdaily.com/2011/01/17/lock-screen-mac/ \n`;
    this.bot.postMessageWithParams(data.channel, msg, botParams);
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

  aliases() {
    return ['poop-board'];
  }

  help() {
    return 'YOU JUST GOT POOPED!!! :poop:';
  }
};
