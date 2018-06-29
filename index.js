'use strict';

const fs = require('fs');
const path = require('path');
const Config = require('./core/config.js');
const Router = require('./core/router.js');
const Debug = require('./core/debug/Debug');
const SlackCatBot = require('./core/slack-cat-bot.js');
const Server = require('./server');
const { RTMClient } = require('@slack/client');

// Global Base Modules.
global.BaseModule = require('./core/base-module.js');
global.BaseStorageModule = require('./core/base-storage-module.js');



class SlackCat {
  constructor(pathToModules, configPath, dbPath) {
    this.pathToModules = pathToModules;
    this.dbPath = dbPath;

    global.STORAGE_PATH = dbPath;
    global.config = new Config(configPath);
  }

  start() {
    // Run debug cmds.
    if (process.argv.length > 2) {
      const debug = new Debug();
      debug.runDebugCommand(process);
      return;
    }

  
    const rtm = new RTMClient(config.getKey('slack_access_token'));
    let router;        
    rtm.start();
    
    rtm.on('authenticated', data => {
      const server = new Server()
      router = new Router(new SlackCatBot(data), server, this.pathToModules);      
      server.start();
    });

    rtm.on('message', data => {
      router.handle(data);
    });

    rtm.on('reaction_added', data => {
      router.handle(data);
    });

    rtm.on('member_joined_channel', data => {
      router.handle(data);
    });
  }
}

module.exports = SlackCat;
