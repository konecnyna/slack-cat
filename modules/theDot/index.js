'use strict';

const dotConfig = config.getKey('dot');
const botParams = {
  icon_emoji: ':red_circle:',
  username: 'Dotbot',
};

function buildUserDottedMsg({ user, dots, channelTag }) {
  return `*${user} just dotted themselves over in ${channelTag}!!!* ${user} dooted _${dots} times_. *FEAR THE :dot:*"`;
}

function buildUserDotsMsg({ user, dotsRow }) {
  if (!dotsRow) {
    return `${user} hasn't dotted themselves... _yet_! :smirk: :dot: `;
  } else {
    const dots = dotsRow.get('dots');
    return `${user} has dotted themselves :dot: *_${dots} times_* :dot:`;
  }
}

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

    if (
      data.subtype === 'message_changed' &&
      triggerWords.includes(data.message.text)
    ) {
      this.updateAndPostDot(data);
    }
  }

  async updateAndPostDot(data) {
    const sourceChannel = await this.bot.getChannelById(data.channel);
    const { members } = await this.bot.getChannelById(dotConfig.channel);

    if (members.includes(data.message.user)) {
      const dotData = await this.updateDot(data);
      const channelTag = `<#${data.channel}|${sourceChannel.name}>`;

      this.bot.postMessageWithParams(
        dotConfig.channel,
        buildUserDottedMsg({ ...dotData, channelTag }),
        botParams
      );
    }
  }

  registerSqliteModel() {
    this.DotModel = this.db.define('dots', {
      id: { type: this.Sequelize.STRING, primaryKey: true },
      name: { type: this.Sequelize.STRING },
      dots: {
        type: this.Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  }

  async updateDot(data) {
    const { user } = data.message;
    const userName = await this.getUserName(data.message.user);

    const dot = await this.upsert(
      this.DotModel,
      { where: { id: user } },
      {
        id: user,
        name: userName,
        dots: 1,
      },
      {
        id: user,
        name: userName,
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
    const user = data.user_text;
    const userId = user.slice(2, -1);
    const dotsRow = await this.DotModel.findOne({
      where: {
        id: userId,
      },
    });

    this.bot.postMessageWithParams(
      data.channel,
      buildUserDotsMsg({ user, dotsRow }),
      botParams
    );
  }

  async postLeaderBoard(data) {
    const dots = await this.DotModel.findAll({
      order: [['dots', 'DESC']],
      limit: 10,
    });

    const fields = [];
    dots.forEach((dot, index) => {
      fields.push({
        title: `${index + 1}. ${dot.get('name')} (${dot.get('dots')} dots)`,
        short: false,
      });
    });

    this.bot.postRawMessage(data.channel, {
      icon_emoji: botParams.icon_emoji,
      username: botParams.username,
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
