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

    this.updateAndPostPoop(data);
  }

  async updateAndPostPoop(data) {
    const poopData = await this.updatePoop(data);
    let msg = `*${poopData.user} just got pooped!!!* ${poopData.user} pooped _${poopData.poops} times_.\nPlease lock your screen next time! http://osxdaily.com/2011/01/17/lock-screen-mac/\n`;
    if (poopData.poops === 1) {
      msg = `*${poopData.user}* got pooped for the first time. That's a big stink! Don't leave your computer unlocked when you're not with it! Side effects can include hacking, stealing, destruction, and...pooping (by one of your sneaky gremlin coworkers). http://osxdaily.com/2011/01/17/lock-screen-mac/`;      
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
    });
  }

  async updatePoop(data) {
    const user = await this.bot.getUserNameFromId(data.user);
    
    const userName = user.user.profile.display_name || user.user.name;
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
    return ['poop-board', ':poop:'];
  }

  help() {
    return 'YOU JUST GOT POOPED!!! :poop:';
  }
};
