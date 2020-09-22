'use strict'
const extend = require('extend')
const { user } = require('./models/MockMessageData')

module.exports = class MockBot {
  constructor() {
    this.name = 'defkon'
    this.botInfo = {
      id: 420
    }
  }

  postMessage(channelId, msg) {
    this.msg = msg
    // Set default bot params.
    this.handlePostMessage(msg);
  }

  postMessageToUser(userId, msg) {
    this.handlePostMessage(msg)
  }

  postMessageToUsers(userList, msg) {
    this.handlePostMessage(msg)
  }

  postMessageToThread(id, msg, ts, params) {
    this.handlePostMessage(msg)
  }

  postMessageWithParams(channelId, msg, params) {
    this.msg = msg
    this.handlePostMessage(msg)
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

    this.handlePostMessage(JSON.stringify(params, null, 2))
  }

  getChannelById(channel) {
    return {
      id: "123",
      members: ['1123', '123123123']
    }
  }

  postRawMessage(channel_id, args) {
    var params = extend(
      {
        channel: channel_id,
        username: this.name
      },
      args || {}
    )

    this.handlePostMessage(JSON.stringify(params, null, 2))
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

  handlePostMessage(msg) {
    console.log(msg)
    process.exit();
  }
}
