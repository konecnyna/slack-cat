'use strict';

const WelcomeHelper = require('./welcome-helper.js');
const columnMap = {
  '--enabled' : "enabled",
  '--channelWelcomeMsgEnabled': 'generic_welcome'
}

const botParams = {
  icon_emoji: ':smiley_cat:',
  username: 'WelcomeCat',
};

module.exports = class WelcomeCat extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    this.welcomeHelper = new WelcomeHelper(this.WelcomeMessageModel);
  }
  async handle(data) {
    if (!data.args) {
      this.bot.postMessageWithParams(data.channel, this.help(), botParams);
      return;
    }

    if (data.args.includes('--displayMessage')) {
      this.handleMemeberJoin(data);
      return;
    }

    if (data.args.includes('--message')) {
      this.bot.postMessageWithParams(
        data.channel,
        `Set channel welcome message to: "${await this.welcomeHelper.setMessage(
          this,
          data
        )}"`, 
        botParams
      );
      return;
    }

    //TODO: Send attachments via dm?
    if (this.cmds().includes(data.args[0])) {
      if (data.args[0] === '--channelWelcomeMsgEnabled' || data.args[0] === '--enabled') {
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
      const name = await this.bot.resolveUserNameFromId(data.user);
      this.bot.postMessageWithParams(data.channel, `Hi ${name}! Welcome!`, botParams);  
    }    
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
      '--displayMessage',
      '--message',
      '--enabled',
      '--channelWelcomeMsgEnabled'      
    ];
  }
  help() {
    return `*Here is how to use WelcomeCat:*\n
> 1. \`?welcomecat --message <The message you want to DM to users when they join the channel>\` | The message will be DMd to any new user joining the channel when the bot is enabled.
> 2. \`?welcomecat --enabled <true|false>\` | This will enable or disable the feature.

That's it! Additional Arguments:
\`${this.cmds().join(', ')}\``;
  }

  getType() {
    return [BaseModule.TYPES.MEMBER_JOINED_CHANNEL, BaseModule.TYPES.MODULE];
  }
};
