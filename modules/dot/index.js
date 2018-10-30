'use strict';

const botParams = {
  icon_emoji: ':dot:',
  username: 'TheDot',
  blacklist: 'channels_blacklist',
};

module.exports = class Dot extends BaseStorageModule {
  async handle(data) {
    if (data.cmd === 'dot-board' || data.cmd === 'dotboard') {
      this.postLeaderBoard(data);
      return;
    }

    if (data.cmd === 'dots') {
      this.postUserDots(data);
      return;
    }

    this.updateAndPostDot(data);
  }

  async updateAndPostDot(data) {
    const dotData = await this.updateDot(data);
    let msg = `*${dotData.user} just got dooted!!!* ${dotData.user} dooted _${
      dotData.dots
    } times_.\nPlease lock your screen next time! http://osxdaily.com/2011/01/17/lock-screen-mac/\n`;
    if (dotData.dots === 1) {
      msg = `*${
        dotData.user
      }* got dooted for the first time. That's a big doot! Don't leave your computer unlocked when you're not with it! Side effects can include hacking, stealing, destruction, and...dooting (by one of your sneaky gremlin coworkers).`;
    }
    this.bot.postMessageWithParams(data.channel, msg, botParams);
  }

  registerSqliteModel() {
    this.DotModel = this.db.define('dots', {
      name: { type: this.Sequelize.STRING, primaryKey: true },
      dots: {
        type: this.Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  }

  async updateDot(data) {
    const userName = await this.getUserName(data.user);
    const dot = await this.upsert(
      this.DotModel,
      { where: { name: userName } },
      {
        name: userName,
        dots: 1,
      },
      {
        dots: this.db.literal('dots + 1'),
      }
    );

    return {
      user: userName,
      dots: dot.get('dots'),
    };
  }

  async getUserName(userId) {
    const user = await this.bot.getUserNameFromId(userId);
    return user.user.profile.display_name || user.user.name;
  }

  async postUserDots(data) {
    let user = data.user_text;
    const matches = data.user_text.match(user);
    if (matches && matches.length > 1) {
      user = await this.getUserNameFromId(matches[1]);
    } else if (!user) {
      user = await this.getUserName(data.user);
    }

    const dotsRow = await this.DotModel.findOne({
      where: {
        name: user,
      },
    });

    let msg = '';
    if (!dotsRow) {
      msg = `${user} has not been dooted... _yet_! :smirk: :dot: `;
    } else {
      const dots = dotsRow.get('dots');
      msg = `${user} has been dooted :dot: *_${dots} times_* :dot:`;
    }

    this.bot.postMessage(data.channel, msg);
  }

  async postLeaderBoard(data) {
    const dots = await this.DotModel.findAll({
      order: [['dots', 'DESC']],
      limit: 10,
    });

    const fields = [];
    dots.forEach((plus, index) => {
      fields.push({
        title: `${index + 1}. ${plus.get('name')} (${plus.get('dots')} dots)`,
        short: false,
      });
    });

    this.bot.postRawMessage(data.channel, {
      icon_emoji: ':dot:',
      username: 'DotBoard',
      attachments: [
        {
          color: '#000000',
          fields: fields,
        },
      ],
    });
  }

  isValidConfig() {
    return (
      config.getKey(botParams.blacklist) &&
      config.getKey(botParams.blacklist).dot
    );
  }

  aliases() {
    return ['dot-board', 'dotboard', ':dot:', 'dots'];
  }

  help() {
    return 'YOU JUST GOT DOOTED!!! :poop:';
  }
};
