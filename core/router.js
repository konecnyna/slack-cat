'use strict';

const requireDir = require('./requiredir');
const cmdPattern = new RegExp(/\?([^\s]+)/, 'i');
const argPattern = new RegExp(/(\-\-([^ ]*\w))/, 'g');
const moduleResolver = new requireDir();


module.exports = class Router {
  constructor(bot, pathToModules, server) {
    this.bot = bot;
    this.pathToModules = pathToModules;
    this.server = server;

    this.modules = {};
    this.overflowModules = {};
    this.reactionModules = {};
    this.memberJoinedModules = {};
    this.rawInputModules = {};
    this.dialogModules = {};

    // Register all modules. Not good lazy solution cuz of aliases for now...
    this.registerModules();
  }

  handle(data) {
    // Websocket starting up...
    if (data.type === 'hello') {
      return;
    }

    if (data.type === 'member_joined_channel') {
      this.handleMemeberJoin(data);
    }

    // Handle reactions
    if (data.type === 'reaction_added') {
      this.handleReaction(data);
    }

    this.handleMsg(data);
  }

  registerModules() {
    // Core modules
    const loadedModules = moduleResolver.loadModules(this.pathToModules);
    Object.keys(loadedModules).forEach(key => {
      const moduleObj = new loadedModules[key](this.bot);
      if (!moduleObj) {
        console.error('Failed to instaniate module: ' + key);
        return;
      }

      if (
        config.getKey('modules_blacklist') &&
        config.getKey('modules_blacklist').includes(key)
      ) {
        console.log('Skipping: ', key, ' in blacklist.');
        return;
      }

      if (moduleObj.getType().includes(BaseModule.TYPES.DIALOG)) {      
        moduleObj.createRoutes(this.server.app);
        this.addModules(key, moduleObj, BaseModule.TYPES.DIALOG, this.dialogModules);                
      } else if (moduleObj.getType().includes(BaseModule.TYPES.ENDPOINT)) {
        moduleObj.createRoutes(this.server.app);        
      }
      
      // Add all modules types to cmd array.
      if (moduleObj.getType().includes(BaseModule.TYPES.MODULE)) {
        this.modules[key] = moduleObj;
        moduleObj.aliases().map(alias => {
          this.modules[alias] = moduleObj;
        });
      }

      this.addModules(key, moduleObj, BaseModule.TYPES.OVERFLOW_CMD, this.overflowModules);
      this.addModules(key, moduleObj, BaseModule.TYPES.REACTION, this.reactionModules);
      this.addModules(key, moduleObj, BaseModule.TYPES.MEMBER_JOINED_CHANNEL, this.memberJoinedModules);
      this.addModules(key, moduleObj, BaseModule.TYPES.RAW_INPUT, this.rawInputModules);
    });

    this.setupDialogCallback();
  }

  addModules(key, module, type, array) {
    if (module.getType().includes(type)) {
        array[key] = module;
    }
  }

  handleReaction(data) {
    Object.keys(this.reactionModules).forEach(key => {
      this.reactionModules[key].handleReaction(data, this.modules);
    });
  }

  handleMemeberJoin(data) {
    Object.keys(this.memberJoinedModules).forEach(key => {
      this.memberJoinedModules[key].handleMemeberJoin(data, this.modules);
    });
  }

  handleRawInput(data) {
    Object.keys(this.rawInputModules).forEach(key => {
      this.rawInputModules[key].handleRawInput(data, this.modules);
    });
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
      this.handleCmdMessage(data);
      return;
    }

    if (data.type === 'message') {
      this.handleRawInput(data);
    }
  }

  handleCmdMessage(data) {
    const matches = this.addExtras(data);
    if (data.cmd && data.cmd === 'cmds') {
      this.showCmds(data);
      return;
    }

    if (matches && matches[1].toLowerCase() in this.modules) {
      const module = this.modules[data.cmd];
      if (
        data.args != null &&
        (data.args.includes('-help') || data.args.includes('--help'))
      ) {
        this.bot.postMessage(data.channel, module.help());
        return;
      }

      module.handle(data);
      return;
    }

    this.handleOverflow(data);
  }

  handleOverflow(data) {
    Object.keys(this.overflowModules).forEach(key => {
      // For consistency.
      if (data.item) {
        data['channel'] = data.item.channel;
      }

      this.overflowModules[key].handle(data);
    });
  }

  async showCmds(data) {
    let list = '';
    Object.keys(this.modules)
      .sort()
      .forEach((key, idx) => {
        list += idx + 1 + '. ' + key + '\n';
      });

    const userData = await this.bot.userDataPromise(data.user);
    this.bot.postMessageToUser(
      userData.user.name,
      'List of cmds:\n```' + list + '```'
    );
    this.bot.postMessage(
      data.channel,
      `<@${userData.user.id}> -- I just sent them to you.`
    );
  }

  setupDialogCallback() {
    this.server.initHandleCallback(body => {
      Object.keys(this.dialogModules).forEach(key => {
        const moduleObj = this.dialogModules[key];        
        if (body.callback_id === moduleObj.dialogCallbackId()) {
          moduleObj.onDialogSubmit(body);
        }
      });
    });
  }

  addExtras(data) {
    const matches = data.text.match(cmdPattern);
    if (!matches) {
      return false;
    }

    const cmd = matches[1].toLowerCase();
    const args = data.text.match(argPattern);
    data['cmd'] = cmd;
    data['args'] = args;
    data['user_text'] = data.text.replace(matches[0], '').trim();
    if (args) {
      args.map(arg => {
        data['user_text'] = data['user_text'].replace(arg, '').trim();
      });
    }

    return matches;
  }
};
