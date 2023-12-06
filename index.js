"use strict";
require('dotenv').config()
const path = require("path");
const Config = require("./core/config.js");
const Router = require("./core/router.js");
const Server = require("./core/server");
const MoudleLoader = require("./core/module-loader");
const SlackCatBot = require("./core/slack-cat-bot.js");
const { RTMClient } = require("@slack/rtm-api");
const SlackCatEvents = require('./core/events');
const Sequelize = require("sequelize");
// Global Base Modules.
global.BaseModule = require("./core/base-module.js");
global.BaseStorageModule = require("./core/base-storage-module.js");
global.HolidayOverride = require("./core/HolidayOverride");

const {
  testMsg,
  testReaction,
  testMemberJoin
} = require("./core/models/MockMessageData");

class SlackCat {
  constructor(pathToModules, configPath, dbPath, verboseDbLogging = false) {
    this.pathToModules = pathToModules;
    global.config = new Config(configPath);
    this.initDatabase(dbPath, verboseDbLogging);
  }

  initDatabase(dbPath, verboseDbLogging) {
    const poolConfig = {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    };

    const dbConfig = config.getKey("db");
    if (!dbConfig) {
      global.database = new Sequelize(null, null, null, {
        dialect: "sqlite",
        storage: dbPath, // global.
        logging: verboseDbLogging,
        pool: poolConfig,
      });
      return;
    }
    console.log("Using remote db...");
    const { dialect, username, password, port, host, dbName, ssl } = dbConfig;
    const sequelizeConfig = {
      dialect: dialect,
      port: port,
      logging: verboseDbLogging,
      pool: poolConfig,
      dialectOptions: {
        ssl: ssl
      }
    };

    if (host) {
      sequelizeConfig["host"] = host;
    }

    global.database = new Sequelize(
      dbName,
      username,
      password,
      sequelizeConfig,
    );
  }

  start() {
    // Run debug cmds.
    if (process.argv.length > 2) {
      global.DEBUG = true;
      this.runDebugCommand();
      return;
    }

    if (config.getKey("use_events_api") === 'true') {
      const bot = new SlackCatBot(data);
      const server = new Server();
      const moduleLoader = new MoudleLoader(bot, server, this.pathToModules);
      const modules = moduleLoader.getModules();

      // Fix me :(((((((((((
      bot.setModules(modules);
      const router = new Router(bot, modules, server);

      server.start(() => {
        SlackCatEvents.publish(SlackCatEvents.EventTypes.SetupComplete, []);
      });
    } else {
      const rtm = new RTMClient(config.getKey("slack_access_token"));
      let router;

      rtm.start();

      rtm.on("authenticated", data => {
        console.log('Incoming RTM authenticated event');
        if (!router) {
          const bot = new SlackCatBot(data);
          const server = new Server();
          const moduleLoader = new MoudleLoader(bot, server, this.pathToModules);
          const modules = moduleLoader.getModules();

          // Fix me :(((((((((((
          bot.setModules(modules);
          router = new Router(bot, modules, server);

          server.start(() => {
            SlackCatEvents.publish(SlackCatEvents.EventTypes.SetupComplete, []);
          });
        }
      });

      rtm.on("message", data => {
        router.handle(data);
      });

      rtm.on("reaction_added", data => {
        router.handle(data);
      });

      rtm.on("member_joined_channel", data => {
        router.handle(data);
      });
    }
  }

  async runDebugCommand() {
    // Reaction debug msg
    try {
      const MockBot = require(path.join(__dirname + "/core", "mock-bot.js"));
      let server;

      // Copy array.
      const args = process.argv.slice(0);
      if (args.includes("--with-server")) {
        server = new Server();
      }

      const bot = new MockBot();
      const moduleLoader = new MoudleLoader(bot, server, this.pathToModules);
      const modules = moduleLoader.getModules();

      // Fix me :(((((((((((
      bot.setModules(modules);
      const router = new Router(bot, modules, server);
      if (server) {
        server.start();
      }

      if (args.includes("member_joined_channel")) {
        await router.handle(testMemberJoin);
      } else if (process.argv.includes("--reaction")) {
        testReaction.reaction = args[2].replace(new RegExp(":", "g"), "");
        console.log("Executing reaction: " + testReaction.reaction);
        await router.handle(testReaction);
      } else {
        // Regular debug message
        testMsg.text = args.splice(2, args.length - 1).join(" ");
        await router.handle(testMsg);
      }
    } catch (e) {
      console.trace(e);
      // Use debug cmd to fail tests on ci. Obvi a hack. 
      process.exitCode = 1
    }
  }
}

module.exports = { SlackCat, SlackCatEvents };
