"use strict";
const extend = require("extend");
const { WebClient } = require("@slack/web-api");
const HolidayOverride = require("./HolidayOverride");

module.exports = class SlackCatBot {
  constructor(data) {
    this.botInfo = data.self;
    this.web = new WebClient(config.getKey("slack_access_token"));
    this.workSpace = new WebClient(config.getKey("slack_access_token_oauth"));
    this.botParams = {};
    this.setupBotParams();
  }

  setupBotParams() {
    const name = config.getKey("bot_name");
    this.icon_emoji = config.getKey("bot_emoji");
    this.icon_url = config.getKey("bot_icon_url");

    this.botParams = {
      username: name || "SlackCat",
    };

    if (this.icon_url) {
      // url takes prority.
      this.botParams["icon_url"] = this.icon_url;
    } else {
      this.botParams["icon_emoji"] = this.icon_emoji || ":cat:";
    }

    // Override slackcat for some fun holidays!
    this.defaultParams = this.botParams;
    if (config.getKey("holiday_override")) {
      this.overrideBotParams();
      setInterval(() => {
        this.overrideBotParams();
      }, 60 * 1000 * 1);
    }
  }

  overrideBotParams() {
    const holidayOverride = new HolidayOverride();
    const override = holidayOverride.getOverride();
    if (override) {
      this.botParams = override;
    } else {
      this.botParams = this.defaultParams;
    }
  }

  async postMessage(id, text) {
    const params = extend(
      {
        text: text,
        channel: id,
      },
      this.botParams,
    );

    return this.postWrappedMessage(params)
  }

  async postMessageWithParams(id, text, extras) {
    const params = extend(
      {
        text: text,
        channel: id,
      },
      extras,
    );

    return this.postWrappedMessage(params)
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
        username: this.botParams.username,
      },
      botParams || {},
      attachments,
    );

    return this.postRawMessage(channel_id, params);
  }

  async postMessageToThread(id, text, ts, params) {
    params = extend(
      {
        text: text,
        channel: id,
        thread_ts: ts,
        username: this.botParams.username,
      },
      params || this.botParams,
    );

    return this.postWrappedMessage(params)
  }

  async postMessageToThreadOrUpdate(id, text, ts, params) {
    return await this.postMessageToThread(id, text, ts, params);
  }

  postRawMessage(channel_id, args) {
    var params = extend(
      {
        channel: channel_id,
        username: this.botParams.username,
      },
      args || {},
    );

    if (
      params["icon_emoji"] === undefined && params["icon_url"] === undefined
    ) {
      if (this.icon_url) {
        params["icon_url"] = this.icon_url;
      } else {
        params["icon_emoji"] = this.icon_emoji;
      }
    }

    return this.postWrappedMessage(params)
  }

  async getUserNameFromId(user_id) {
    const stackTrace = new Error()
    return await this.web.users
      .info({ user: user_id })
      .catch((error) => {
        console.log(stackTrace.stack)
        console.log(error)
      });
  }

  async resolveUserNameFromId(user_id) {
    const randUserData = await this.userDataPromise(user_id);
    return randUserData.user.profile.display_name
      ? randUserData.user.profile.display_name
      : randUserData.user.profile.real_name;
  }

  userDataPromise(user_id) {
    const stackTrace = new Error()

    return this.web.users
      .info({ user: user_id })
      .catch((error) => {
        console.log(stackTrace.stack)
        console.log(error)
      });;
  }


  postMessageToUser(userId, msg) {
    const stackTrace = new Error()

    return this.web.conversations
      .open({
        users: userId,
      })
      .then((res) => {
        this.web.chat.postMessage({
          channel: res.channel.id,
          text: msg,
        });
      })
      .catch((error) => {
        console.log(stackTrace.stack)
        console.log(error)
      });
  }

  postMessageToUsers(userList, msg) {
    const stackTrace = new Error()
    return this.web.conversations
      .open({
        users: userList.join(","),
      })
      .then((res) => {
        this.web.chat.postMessage({
          channel: res.channel.id,
          text: msg,
        });
      })
      .catch((error) => {
        console.log(stackTrace.stack)
        console.log(error)
      });
  }

  getChannelMembers(channel) {
    const stackTrace = new Error()
    // limit under 1000 will result in pagination.
    return this.web.conversations
      .members({
        channel: channel,
        limit: 1000,
      })
      .then((res) => {
        return res.members;
      })
      .catch((error) => {
        console.log(stackTrace.stack)
        console.log(error)
      });
  }

  getChannelById(channel) {
    const stackTrace = new Error()
    return this.web.conversations
      .info({
        channel: channel,
      })
      .then((res) => {
        return res.channel;
      })
      .catch((error) => {
        console.log(stackTrace.stack)
        console.log(error)
      });
  }

  setModules(modules) {
    this.modules = modules;
  }

  postWrappedMessage(params) {
    const stackTrace = new Error()
    return this.web.chat
      .postMessage(params)
      .catch((error) => {
        console.log(stackTrace.stack)
        console.log(error)
      });

  }

  async getUserNameDisplayNameFromId(id) {
    const userData = await this.getUserNameFromId(id);
    return userData.user.profile.display_name || userData.user.name;
  }

  async getUserNameFromText(text) {
    if (!text) {
      return null;
    }

    const rgx = /<@([^\s|\<]+)>/g;
    const matches = rgx.exec(text);
    if (!matches) {
      return null;
    }

    const slackUser = await this.getUserNameFromId(matches[1].toUpperCase());
    return slackUser.user.name;
  }

  async setStatus(userId, icon, text) {
    return await this.workSpace.users.profile.set({
      user: userId,
      profile: {
        "status_text": text,
        "status_emoji": icon,
        "status_expiration": 0,
      },
    });
  }
};
