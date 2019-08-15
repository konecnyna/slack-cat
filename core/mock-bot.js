'use strict'
const extend = require('extend')
const { user } = require('./models/MockMessageData')

module.exports = class MockBot {
  constructor() {
    this.name = 'defkon'
  }

  postMessage(channelId, msg) {
    this.msg = msg
    // Set default bot params.
    if (this.callback) {
      this.callback(msg)
    } else {
      console.log(msg)
    }
  }

  postMessageToThread(id, text, ts, params) {
    if (this.callback) {
      this.callback(text)
    } else {
      console.log(text)
    }
  }

  postMessageWithParams(channelId, msg, params) {
    this.msg = msg
    if (this.callback) {
      this.callback(msg)
    } else {
      console.log(msg)
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
        username: this.name
      },
      botParams || {},
      attachments
    )

    this.postRawMessage(channel_id, params)
  }

  postRawMessage(channel_id, args) {
    var params = extend(
      {
        channel: channel_id,
        username: this.name
      },
      args || {}
    )

    if (this.callback) {
      this.callback(params)
    }
    console.log(JSON.stringify(params, null, 2))
  }

  // Prob a better way of doing this? Handle all the request/async functions.
  setCallback(callback) {
    this.callback = callback
  }

  postRawMessage(channel_id, args) {
    var params = extend(
      {
        channel: channel_id,
        username: this.name
      },
      args || {}
    )

    if (this.callback) {
      return this.callback(params)
    }
    console.log(JSON.stringify(params, null, 2))
  }

  getUserNameFromId(user_id) {
    return this.getFakeUser()
  }

  async resolveUserNameFromId(user_id) {
    const randUserData = await this.userDataPromise(user_id)
    return randUserData.user.profile.display_name
      ? randUserData.user.profile.display_name
      : randUserData.user.profile.real_name
  }

  userDataPromise(user_id) {
    return this.getFakeUser()
  }

  getFakeUser() {
    return user
  }

  setModules(modules) {
    this.modules = modules
  }

  async getUserNameDisplayNameFromId(id) {
    const userData = await this.getUserNameFromId(id);
    return userData.user.profile.display_name || userData.user.name;
  }

  async getUserNameFromCommand(data) {
    if (!data.cmd) {
      return null;
    }

    const rgx = /<@([^\s|\<]+)>/g
    const matches = rgx.exec(data.cmd);
    if (!matches) {
      return null
    }

    const slackUser = await this.getUserNameFromId(matches[1].toUpperCase())
    return slackUser.user.name;
  }
}
