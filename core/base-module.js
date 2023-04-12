'use strict';
const axios = require('axios');
const qs = require('querystring');

class Err extends Error {
  constructor(message) {
    super(message);
    this.classLogName = this.constructor.name;
  }
}

module.exports = class BaseModule extends Err {
  constructor(bot, message) {
    super(message)
    if (new.target === BaseModule) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }

    if (this.help === undefined) {
      throw new TypeError('Child class must implement `help()` method');
    }

    this.checkForOverriddenMethod(
      BaseModule.TYPES.MODULE,
      this.handle,
      'handle'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.REACTION,
      this.handleReaction,
      'handleReaction'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.MESSAGE_EDITED,
      this.handleMessageEdited,
      'handleMessageEdited'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.MEMBER_JOINED_CHANNEL,
      this.handleMemberJoin,
      'handleMemberJoin'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.OVERFLOW_CMD,
      this.handleOverflowCmd,
      'handleOverflowCmd'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.MEMBER_JOINED_CHANNEL,
      this.getChannelId,
      'getChannelId'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.RAW_INPUT,
      this.handleRawInput,
      'handleRawInput'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.DIALOG,
      this.onDialogSubmit,
      'onDialogSubmit'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.DIALOG,
      this.dialogCallbackId,
      'dialogCallbackId (Please make sure you setup dialogs correctly: https://github.com/konecnyna/slack-cat/wiki/Dialog )'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.MESSAGE_ACTION,
      this.onActionSubmit,
      'onActionSubmit'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.MESSAGE_ACTION,
      this.actionCallbackId,
      'actionCallbackId (Please make sure you add action to slack api with the same callback id)'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.ENDPOINT,
      this.createRoutes,
      'createRoutes()'
    );

    this.checkForOverriddenMethod(
      BaseModule.TYPES.ENDPOINT,
      this.secretHash,
      'secretHash()'
    );

    this.bot = bot;
  }

  checkForOverriddenMethod(type, func, funcName) {
    if (this.getType().includes(type) && func === undefined) {
      throw new TypeError(`${type} module must implement ${funcName}`);
    }
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
    data.user_text = data.user_text.replace(
      argsData.matches[0],
      userData.user.name
    );
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

  showDialog(dialogConfig, body, res) {
    // extract the verification token, slash command text,
    // and trigger ID from payload
    const { token, text, trigger_id } = body;

    const dialog = {
      token: config.getKey('slack_access_token'),
      trigger_id,
      dialog: JSON.stringify(dialogConfig),
    };
    // open the dialog by calling dialogs.open method and sending the payload
    axios
      .post('https://slack.com/api/dialog.open', qs.stringify(dialog))
      .then(result => {
        res.send('');
      })
      .catch(err => {
        console.log('dialog.open call failed: %o', err);
        res.sendStatus(500);
      });
  }

  static get TYPES() {
    return {
      MODULE: 'module',
      OVERFLOW_CMD: 'overflow_cmd',
      REACTION: 'reaction',
      MESSAGE_EDITED: 'message_edited',
      MEMBER_JOINED_CHANNEL: 'member_joined_channel',
      RAW_INPUT: 'raw_input',
      DIALOG: 'dialog',
      ENDPOINT: 'endpoint',
      SERVICE: 'service',
      MESSAGE_ACTION: 'message_action',
    };
  }
};
