'use strict'

const cmdPattern = new RegExp(/\?\s?([^\s]+)/, 'i')
const argPattern = new RegExp(/(\-\-([^ ]*\w))/, 'g')
const { ALL } = require('./constants')

module.exports = class Router {
  constructor(bot, modules, server) {
    this.bot = bot

    this.modules = modules.modules
    this.overflowModules = modules.overflowModules
    this.reactionModules = modules.reactionModules
    this.messageEditedModules = modules.messageEditedModules
    this.memberJoinedModules = modules.memberJoinedModules
    this.rawInputModules = modules.rawInputModules
    this.dialogModules = modules.dialogModules
    this.serviceModules = modules.serviceModules
    this.messageActionModules = modules.messageActionModules

    this.server = server

    if (this.server) {
      this.setupCallback()
    }
  }

  handle(data) {
    // Websocket starting up...
    if (data.type === 'hello') {
      return
    }

    try {
      if (data.type === 'member_joined_channel') {
        this.handleMemberJoin(data)
      }

      // Handle reactions
      if (data.type === 'reaction_added') {
        this.handleReaction(data)
      }

      // Handle message edits
      if (data.type === 'message' && data.message && data.message.edited) {
        this.handleMessageEdited(data)
      }

      this.handleMsg(data)
    } catch (e) {
      console.error(`Command ${data.cmd} threw an error!`, e.message);
    }
  }

  handleReaction(data) {
    Object.keys(this.reactionModules).forEach(key => {
      this.reactionModules[key].handleReaction(data, this.modules)
    })
  }

  handleMessageEdited(data) {
    Object.keys(this.messageEditedModules).forEach(key => {
      this.messageEditedModules[key].handleMessageEdited(data, this.modules)
    })

    const handleMsg = data.message;
    handleMsg['event_ts'] = data.event_ts;
    handleMsg['ts'] = data.ts;
    handleMsg['channel'] = data.channel
    this.handleMsg(handleMsg);
  }

  handleMemberJoin(data) {
    Object.keys(this.memberJoinedModules).forEach(key => {
      const module = this.memberJoinedModules[key]
      if (
        module.getChannelId() === data.channel ||
        module.getChannelId() === ALL
      ) {
        module.handleMemberJoin(data, this.modules)
      }
    })
  }

  handleRawInput(data) {
    Object.keys(this.rawInputModules).forEach(key => {
      this.rawInputModules[key].handleRawInput(data, this.modules)
    })

  }

  handleMsg(data) {
    // Handle messages.
    if (
      !data.bot_id &&
      data.text !== undefined &&
      data.text.length > 0 &&
      data.type === 'message' &&
      data.text.charAt(0) === '?'
    ) {
      this.handleCmdMessage(data)
      return
    }

    if (data.type === 'message') {
      this.handleRawInput(data)
    }
  }

  handleCmdMessage(data) {
    const matches = this.addExtras(data)
    if (matches && matches[1].toLowerCase() in this.modules) {
      const module = this.modules[data.cmd]
      if (
        data.args != null &&
        (data.args.includes('-help') || data.args.includes('--help'))
      ) {
        this.bot.postMessage(data.channel, module.help())
        return
      }

      module.handle(data)
      return
    }

    this.handleOverflow(data)
  }

  handleOverflow(data) {
    Object.keys(this.overflowModules).forEach(key => {
      // For consistency.
      if (data.item) {
        data['channel'] = data.item.channel
      }

      this.overflowModules[key].handleOverflowCmd(data)
    })
  }

  setupCallback() {
    this.server.initHandleCallback(body => {
      Object.keys(this.messageActionModules).forEach(key => {
        const moduleObj = this.messageActionModules[key]
        if (body.callback_id === moduleObj.actionCallbackId()) {
          moduleObj.onActionSubmit(body)
        }
      })

      Object.keys(this.dialogModules).forEach(key => {
        const moduleObj = this.dialogModules[key]
        if (body.callback_id === moduleObj.dialogCallbackId()) {
          moduleObj.onDialogSubmit(body)
        }
      })
    })
  }

  addExtras(data) {
    const matches = data.text.match(cmdPattern)
    if (!matches) {
      return false
    }

    const cmd = matches[1].toLowerCase()
    const args = data.text.match(argPattern) || []
    data['cmd'] = cmd
    data['args'] = args
    data['user_text'] = data.text.replace(matches[0], '').trim()
    if (args) {
      args.map(arg => {
        data['user_text'] = data['user_text'].replace(arg, '').trim()
      })
    }

    return matches
  }
}
