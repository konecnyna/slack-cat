'use strict';

const WelcomeHelper = require('./welcome-helper.js');
const WelcomeDialog = require('./welcome-dialog');
const columnMap = {
  '--enabled' : "enabled",
  '--channelMsgEnabled': 'generic_welcome'
}

const botParams = {
  icon_emoji: ':smiley_cat:',
  username: 'WelcomeCat',
};

module.exports = class WelcomeCat extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    this.welcomeHelper = new WelcomeHelper(this.WelcomeMessageModel);
    this.welcomeDialog = new WelcomeDialog(this);

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

    
    if (this.cmds().includes(data.args[0])) {
      if (data.args[0] === '--channelMsgEnabled' || data.args[0] === '--enabled') {
        data.user_text = (data.user_text === 'true');
      }

      this.welcomeHelper.updateModel(data.channel, columnMap[data.args[0]], data.user_text);
      this.bot.postMessageWithParams(data.channel, "Set!", botParams);
      return;
    }

    this.bot.postMessageWithParams(data.channel, "Bad command.", botParams);
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
      this.bot.postMessageToUser(userData.user.name, msg, botParams);              
    }
      

    if (welcomeMessage.get('generic_welcome')) {
      const userData = await this.bot.userDataPromise(data.user);      
      this.bot.postMessageWithParams(data.channel, `Hi <@${userData.user.id}>! Welcome!`, botParams);  
    }    
  }

  onDialogSubmit(body) {
    console.log("HI!");
    this.welcomeDialog.onDialogSubmit(body);
  }

  createRoutes(app) {
    this.welcomeDialog.createRoutes(app);
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
      enabled: this.Sequelize.BOOLEAN
    });
  }

  cmds() {
    return [
      '--test',
      '--msg',
      '--enabled',
      '--channelMsgEnabled'      
    ];
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
    return [BaseModule.TYPES.MEMBER_JOINED_CHANNEL, BaseModule.TYPES.MODULE, BaseModule.TYPES.DIALOG];
  }
};
