'use strict'
const path = require('path')
const Config = require('./core/config.js')
const Router = require('./core/router.js')
const Server = require('./core/server')
const MoudleLoader = require('./core/module-loader')
const SlackCatBot = require('./core/slack-cat-bot.js')
const { RTMClient } = require('@slack/client')

// Global Base Modules.
global.BaseModule = require('./core/base-module.js')
global.BaseStorageModule = require('./core/base-storage-module.js')
global.HolidayOverride = require('./core/HolidayOverride')

const {
  testMsg,
  testReaction,
  testMemberJoin
} = require('./core/models/MockMessageData')

class SlackCat {
  constructor(pathToModules, configPath, dbPath) {
    this.pathToModules = pathToModules
    this.dbPath = dbPath

    global.STORAGE_PATH = dbPath
    global.config = new Config(configPath)
  }

  start() {
    // Run debug cmds.
    if (process.argv.length > 2) {
      this.runDebugCommand()
      return
    }

    const rtm = new RTMClient(config.getKey('slack_access_token'))
    let router;

    rtm.start()

    rtm.on('authenticated', data => {
      const bot = new SlackCatBot(data)
      const server = new Server()
      const moduleLoader = new MoudleLoader(bot, server, this.pathToModules)
      const modules = moduleLoader.getModules()

      // Fix me :(((((((((((
      bot.setModules(modules)
      router = new Router(bot, modules, server)
      server.start()
    })

    rtm.on('message', data => {
      router.handle(data)
    })

    rtm.on('reaction_added', data => {
      router.handle(data)
    })

    rtm.on('member_joined_channel', data => {
      router.handle(data)
    })
  }

  runDebugCommand() {
    // Reaction debug msg
    const MockBot = require(path.join(__dirname + '/core', 'mock-bot.js'))
    let server
    if (process.argv.includes('--with-server')) {
      server = new Server()
    }

    const bot = new MockBot()
    const moduleLoader = new MoudleLoader(bot, server, this.pathToModules)
    const modules = moduleLoader.getModules()

    // Fix me :(((((((((((
    bot.setModules(modules)
    const router = new Router(bot, modules, server)
    if (server) {
      server.start()
    }

    if (process.argv.includes('member_joined_channel')) {
      router.handle(testMemberJoin)
      return
    }

    if (process.argv[2].includes(':')) {
      testReaction.reaction = process.argv[2].replace(new RegExp(':', 'g'), '')
      console.log('Executing reaction: ' + testReaction.reaction)
      router.handle(testReaction)
      return
    }

    // Regular debug message
    testMsg.text = process.argv.splice(2, process.argv.length - 1).join(' ')
    router.handle(testMsg)
  }
}

module.exports = SlackCat
