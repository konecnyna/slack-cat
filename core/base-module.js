'use strict';


const defaultBotParams = {
  icon_emoji: ':cat:',
};


module.exports = class BaseModule {

  
  constructor(bot) {
    if (new.target === BaseModule) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }

    if (this.handle === undefined) {
      throw new TypeError('Child class must implement `handle(data);`');
    }

    if (this.help === undefined) {
      throw new TypeError('Child class must implement `help()` method');
    }

    if (this.getType().includes(BaseModule.TYPES.REACTION) && this.handleReaction === undefined) {
      throw new TypeError('Child class must implement `handleReaction()` if type is REACTION'); 
    }

    if (this.getType().includes(BaseModule.TYPES.MEMBER_JOINED_CHANNEL) && this.handleMemeberJoin === undefined) {
      throw new TypeError('Child class must implement `handleMemeberJoin()` if type is MEMBER_JOINED_CHANNEL'); 
    }

    if (this.getType().includes(BaseModule.TYPES.RAW_INPUT) && this.handleRawInput === undefined) {
      throw new TypeError('Child class must implement `handleRawInput()` if type is RAW_INPUT'); 
    }


    this.bot = bot;
  }

  getUserArg(data) {
    if (!data.user_text) {
      return null;
    }

    const userPattern = new RegExp(/\<@(.*.)\>/, 'i');
    const split = data.user_text.split(' ');
    const matches = split[0].match(userPattern);

    return {
      matches: matches,
      text: split.splice(1, split.length).join(' '),
    };
  }


  async replaceSlackUserWithUserName(data) {
    const argsData = this.getUserArg(data);
    if (!argsData || !argsData.matches) {
      return;
    }


    const userData = await this.bot.userDataPromise(argsData.matches[1]);    
    data.user_text = data.user_text.replace(argsData.matches[0], userData.user.name);    
  }
  
  /**
   *
   * Override this method for mutliple cmds for one class.
   */
  aliases() {
    return [];
  }

  getType() {
    return [BaseModule.TYPES.MODULE];
  }

  static get TYPES() {
    return {
      MODULE: "module",
      OVERFLOW_CMD: "overflow_cmd",
      REACTION: "reaction",
      MEMBER_JOINED_CHANNEL: "member_joined_channel",
      RAW_INPUT: "raw_input",
    };
  }

};
