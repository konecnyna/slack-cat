'use strict';
const axios = require('axios');
const qs = require('querystring');

module.exports = class BaseModule {
  constructor(bot) {
    if (new.target === BaseModule) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }

    if (this.help === undefined) {
      throw new TypeError('Child class must implement `help()` method');
    }

    this.checkForOverridenMethod(
      BaseModule.TYPES.MODULE,
      this.handle,
      'handle'
    );

    this.checkForOverridenMethod(
      BaseModule.TYPES.REACTION,
      this.handleReaction,
      'handleReaction'
    );

    this.checkForOverridenMethod(
      BaseModule.TYPES.MESSAGE_EDITED,
      this.handleMessageEdited,
      'handleMessageEdited'
    );

    this.checkForOverridenMethod(
      BaseModule.TYPES.MEMBER_JOINED_CHANNEL,
      this.handleMemeberJoin,
      'handleMemeberJoin'
    );

    this.checkForOverridenMethod(
      BaseModule.TYPES.MEMBER_JOINED_CHANNEL,
      this.getChannelId,
      'getChannelId'
    );

    this.checkForOverridenMethod(
      BaseModule.TYPES.RAW_INPUT,
      this.handleRawInput,
      'handleRawInput'
    );

    this.checkForOverridenMethod(
      BaseModule.TYPES.DIALOG,
      this.onDialogSubmit,
      'onDialogSubmit'
    );

    this.checkForOverridenMethod(
      BaseModule.TYPES.DIALOG,
      this.dialogCallbackId,
      'dialogCallbackId (Please make sure you setup dialogs correctly: https://github.com/konecnyna/slack-cat/wiki/Dialog )'
    );

    this.checkForOverridenMethod(
      BaseModule.TYPES.ENDPOINT,
      this.createRoutes,
      'createRoutes'
    );

    this.bot = bot;
  }

  checkForOverridenMethod(type, func, funcName) {
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
    };
  }
};
