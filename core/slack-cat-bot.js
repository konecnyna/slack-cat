'use strict';
const extend = require('extend');
const { WebClient } = require('@slack/client');

module.exports = class SlackCatBot {
  constructor(token) {
    this.web = new WebClient(config.getKey('slack_access_token'));
    const name = config.getKey('bot_name');
    const icon_emoji = config.getKey('bot_emoji');
    const icon_url = config.getKey('bot_icon_url');

    this.botParams = {
      username: name || 'SlackCat',
    };

    if (icon_url) {
      // url takes prority.
      this.botParams['icon_url'] = icon_url;
    } else {
      this.botParams['icon_emoji'] = icon_emoji || ':cat:';
    }
  }

  postMessageSequentially(data, messages) {
    const promiseSerial = funcs =>
      funcs.reduce(
        (promise, func) =>
          promise.then(result =>
            func().then(Array.prototype.concat.bind(result))
          ),
        Promise.resolve([])
      );

    // convert each url to a function that returns a promise
    const funcs = messages.map(msg => () =>
      this.postMessage(data.channel, msg)
    );

    // execute Promises in serial
    promiseSerial(funcs).catch(console.error.bind(console));
  }

  async postMessage(id, text) {
    const params = extend(
      {
        text: text,
        channel: id,
      },
      this.botParams
    );

    this.web.chat.postMessage(params).catch(console.error);
  }

  async postMessageWithParams(channelId, msg, params) {
    const params = extend(
      {
        text: text,
        channel: id,
        u,
      },
      this.botParams
    );

    return this.web.chat.postMessage(params).catch(console.error);
  }

  postFancyMessage(channel_id, icon_emoji, color, title, body, botParams) {
    var attachments = {
      icon_emoji: icon_emoji,
      attachments: [
        {
          color: color,
          title: title,
          text: body,
        },
      ],
    };

    var params = extend(
      {
        channel: channel_id,
        username: this.name,
      },
      botParams || {},
      attachments
    );

    return this.postRawMessage(channel_id, params);
  }

  postMessageToThread(id, text, ts, params) {
    params = extend(
      {
        text: text,
        channel: id,
        thread_ts: ts,
        username: this.name,
      },
      params || this.botParams
    );

    return this.web.chat.postMessage(params);
  }

  postRawMessage(channel_id, args) {
    var params = extend(
      {
        channel: channel_id,
        username: this.name,
      },
      args || {}
    );

    return this.web.chat.postMessage(params);
  }

  getUserNameFromId(user_id) {
    return this.web.users.info({
      user: user_id,
    });
  }

  async resolveUserNameFromId(user_id) {
    const randUserData = await this.userDataPromise(user_id);
    return randUserData.user.profile.display_name
      ? randUserData.user.profile.display_name
      : randUserData.user.profile.real_name;
  }

  userDataPromise(user_id) {
    return this.web.users.info({
      user: user_id,
    });
  }

  getChannelById(channel) {
    return this.web.channels
      .list()
      .then(res => {
        return res.channels.find(it => {
          return it.id === channel;
        });
      })
      .catch(console.error);
  }
};
