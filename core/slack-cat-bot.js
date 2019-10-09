'use strict'
const extend = require('extend')
const { WebClient } = require('@slack/web-api');
const HolidayOverride = require('./HolidayOverride')

module.exports = class SlackCatBot {
  constructor(data) {
    this.botInfo = data.self
    this.web = new WebClient(config.getKey('slack_access_token'));
    this.workSpace = new WebClient(config.getKey('slack_access_token_oauth'))
    this.botParams = {}
    this.setupBotParams()
  }

  setupBotParams() {
    const name = config.getKey('bot_name')
    const icon_emoji = config.getKey('bot_emoji')
    const icon_url = config.getKey('bot_icon_url')

    this.botParams = {
      username: name || 'SlackCat'
    }

    if (icon_url) {
      // url takes prority.
      this.botParams['icon_url'] = icon_url
    } else {
      this.botParams['icon_emoji'] = icon_emoji || ':cat:'
    }

    // Override slackcat for some fun holidays!
    this.defaultParams = this.botParams
    if (config.getKey('holiday_override')) {
      this.overrideBotParams()
      setInterval(() => {
        this.overrideBotParams()
      }, 60 * 1000 * 1)
    }
  }

  overrideBotParams() {
    const holidayOverride = new HolidayOverride()
    const override = holidayOverride.getOverride()
    if (override) {
      this.botParams = override
    } else {
      this.botParams = this.defaultParams
    }
  }

  async postMessage(id, text) {
    const params = extend(
      {
        text: text,
        channel: id
      },
      this.botParams
    )

    try {
      return await this.web.chat.postMessage(params)
    } catch (e) {
      console.error('postMessage', e)
    }
  }

  async postMessageWithParams(id, text, extras) {
    const params = extend(
      {
        text: text,
        channel: id
      },
      extras
    )

    try {
      return await this.web.chat.postMessage(params)
    } catch (e) {
      console.error('postMessage', e)
    }
  }

  postFancyMessage(channel_id, icon_emoji, color, title, body, botParams) {
    var attachments = {
      icon_emoji: icon_emoji,
      attachments: [
        {
          color: color,
          title: title,
          text: body
        }
      ]
    }

    var params = extend(
      {
        channel: channel_id,
        username: this.botParams.username
      },
      botParams || {},
      attachments
    )

    return this.postRawMessage(channel_id, params)
  }

  async postMessageToThread(id, text, ts, params) {
    params = extend(
      {
        text: text,
        channel: id,
        thread_ts: ts,
        username: this.botParams.username
      },
      params || this.botParams
    )


    return await this.web.chat.postMessage(params)
  }

  async postMessageToThreadOrUpdate(id, text, ts, params) {

    return await this.postMessageToThread(id, text, ts, params)
  }

  postRawMessage(channel_id, args) {
    var params = extend(
      {
        channel: channel_id,
        username: this.botParams.username
      },
      args || {}
    )

    return this.web.chat.postMessage(params)
  }

  async getUserNameFromId(user_id) {
    return await this.web.users.info({
      user: user_id
    })
  }

  async resolveUserNameFromId(user_id) {
    const randUserData = await this.userDataPromise(user_id)
    return randUserData.user.profile.display_name
      ? randUserData.user.profile.display_name
      : randUserData.user.profile.real_name
  }

  userDataPromise(user_id) {
    return this.web.users.info({
      user: user_id
    })
  }

  postMessageToUser(userId, msg) {
    return this.web.conversations
      .open({
        users: userId
      })
      .then(res => {
        this.web.chat.postMessage({
          channel: res.channel.id,
          text: msg
        })
      })
      .catch(console.error)
  }

  postMessageToUsers(userList, msg) {
    return this.web.conversations
      .open({
        users: userList.join(',')
      })
      .then(res => {
        this.web.chat.postMessage({
          channel: res.channel.id,
          text: msg
        })
      })
      .catch(console.error)
  }

  getChannelById(channel) {
    return this.web.channels
      .info({
        channel: channel
      })
      .then(res => {
        return res.channel
      })
      .catch(console.error)
  }

  setModules(modules) {
    this.modules = modules
  }

  async getUserNameDisplayNameFromId(id) {
    const userData = await this.getUserNameFromId(id);
    return userData.user.profile.display_name || userData.user.name;
  }

  async getUserNameFromText(text) {
    if (!text) {
      return null;
    }

    const rgx = /<@([^\s|\<]+)>/g
    const matches = rgx.exec(text);
    if (!matches) {
      return null
    }

    const slackUser = await this.getUserNameFromId(matches[1].toUpperCase())
    return slackUser.user.name;
  }
}
