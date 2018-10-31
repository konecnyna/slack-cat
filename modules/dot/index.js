'use strict';

const dotConfig = config.getKey('dot');

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
  }

  handleMessageEdited(data) {
    const triggerWords = ['.', '..', '...', ':dot:', ':dot-edited:'];

    if (triggerWords.includes(data.message.text)) {
      this.updateAndPostDot(data);
    }
  }

  async updateAndPostDot(data) {
    const dotData = await this.updateDot(data);

    const channelData = await this.bot.getChannelById(dotConfig.channel);
    if (channelData.members.includes(data.message.user)) {
      let msg = `*${dotData.user} just got dooted!!!* ${dotData.user} dooted _${
        dotData.dots
      } times_.`;

      this.bot.postMessageWithParams(data.channel, msg, dotConfig);
    }
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
    const userName = await this.getUserName(data.message.user);
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
      config.getKey(dotConfig.blacklist) &&
      config.getKey(dotConfig.blacklist).dot
    );
  }

  aliases() {
    return ['dot-board', 'dotboard', ':dot:', 'dots'];
  }

  getType() {
    return [BaseModule.TYPES.MODULE, BaseModule.TYPES.MESSAGE_EDITED];
  }

  help() {
    return 'YOU JUST GOT DOOTED!!! :poop:';
  }
};
