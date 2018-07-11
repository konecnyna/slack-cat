'use strict';

const WelcomeDialog = require('./welcome-dialog');
const WelcomeHelper = require('./welcome-helper.js');
const { ALL } = require('../../core/constants');
const columnMap = {
  '--enabled': 'enabled',
  '--channelMsgEnabled': 'generic_welcome',
};

const botParams = {
  icon_emoji: ':smiley_cat:',
  username: 'WelcomeCat',
};

const DIALOG_ID = 'welcome-cat-dialog';

module.exports = class WelcomeCat extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    this.welcomeHelper = new WelcomeHelper(this.WelcomeMessageModel, this);
    this.welcomeDialog = new WelcomeDialog(this, this.welcomeHelper);
  }
  async handle(data) {
    if (!data.args) {
      this.bot.postMessageWithParams(data.channel, this.help(), botParams);
      return;
    }

    if (data.args.includes('--test')) {
      this.handleMemeberJoin(data);
      return;
    }

    this.bot.postMessageWithParams(data.channel, 'Bad command.', botParams);
  }

  async handleMemeberJoin(data) {
    const welcomeMessage = await this.welcomeHelper.getOptionsForChannel(
      data.channel
    );

    if (welcomeMessage == null || !welcomeMessage.get('enabled')) {
      return;
    }

    const msg = welcomeMessage.get('message');
    if (msg != null) {
      const userData = await this.bot.userDataPromise(data.user);
      this.bot.postMessageToUser(userData.user.id, msg, botParams);
    }

    if (welcomeMessage.get('generic_welcome')) {
      const userData = await this.bot.userDataPromise(data.user);
      this.bot.postMessageWithParams(
        data.channel,
        `Hi <@${userData.user.id}>! Welcome!`,
        botParams
      );
    }
  }

  onDialogSubmit(body) {
    this.welcomeDialog.onDialogSubmit(body);
  }

  createRoutes(app) {
    this.welcomeDialog.createRoutes(app, DIALOG_ID);
  }

  dialogCallbackId() {
    return DIALOG_ID;
  }

  registerSqliteModel() {
    this.WelcomeMessageModel = this.db.define('welcome_message', {
      channel: {
        type: this.Sequelize.STRING,
        primaryKey: true,
      },
      message: this.Sequelize.STRING,
      doc_title: this.Sequelize.STRING,
      doc_link: this.Sequelize.STRING,
      footer: this.Sequelize.STRING,
      color: this.Sequelize.STRING,
      generic_welcome: this.Sequelize.BOOLEAN,
      enabled: this.Sequelize.BOOLEAN,
    });
  }

  getChannelId() {
    return ALL;
  }

  cmds() {
    return ['--test', '--msg', '--enabled', '--channelMsgEnabled'];
  }
  help() {
    return `*Here is how to use WelcomeCat:*\n
> 1. \`?welcomecat --message <The message you want to DM to users when they join the channel>\` | The message will be DMd to any new user joining the channel when the bot is enabled.
> 2. \`?welcomecat --enabled <true|false>\` | This will enable or disable the feature.

That's it! Additional Arguments:
\`${this.cmds().join(', ')}\``;
  }

  aliases() {
    return ['welcomebot'];
  }

  getType() {
    return [
      BaseModule.TYPES.MEMBER_JOINED_CHANNEL,
      BaseModule.TYPES.MODULE,
      BaseModule.TYPES.DIALOG,
    ];
  }
};
