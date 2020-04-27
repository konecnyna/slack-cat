"use strict";
const path = require("path");
const Config = require("./core/config.js");
const Router = require("./core/router.js");
const Server = require("./core/server");
const MoudleLoader = require("./core/module-loader");
const SlackCatBot = require("./core/slack-cat-bot.js");
const { RTMClient } = require("@slack/rtm-api");
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
  constructor(pathToModules, configPath, dbPath) {
    this.pathToModules = pathToModules;
    global.config = new Config(configPath);
    this.initDatabase(dbPath);
  }

  initDatabase(dbPath) {
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
        logging: false,
        pool: poolConfig,
      });
      return;
    }
    console.log("Using remote db...");
    const { dialect, username, password, port, host, dbName, ssl } = dbConfig;
    const sequelizeConfig = {
      dialect: dialect,
      port: port,
      logging: false,
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

    const rtm = new RTMClient(config.getKey("slack_access_token"));
    let router;

    rtm.start();

    rtm.on("authenticated", data => {
      const bot = new SlackCatBot(data);
      const server = new Server();
      const moduleLoader = new MoudleLoader(bot, server, this.pathToModules);
      const modules = moduleLoader.getModules();

      // Fix me :(((((((((((
      bot.setModules(modules);
      router = new Router(bot, modules, server);
      server.start();
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

  runDebugCommand() {
    // Reaction debug msg
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
      router.handle(testMemberJoin);
    } else if (process.argv.includes("--reaction")) {
      testReaction.reaction = args[2].replace(new RegExp(":", "g"), "");
      console.log("Executing reaction: " + testReaction.reaction);
      router.handle(testReaction);
    } else {
      // Regular debug message
      testMsg.text = args.splice(2, args.length - 1).join(" ");
      router.handle(testMsg);
    }
  }
}

module.exports = SlackCat;
