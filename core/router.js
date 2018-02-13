'use strict';

const requireDir = require('./requiredir');

const cmdPattern = new RegExp(/\?([^\s]+)/, 'i');
const argPattern = new RegExp(/(\-\-([^ ]*\w))/, 'g');

const moduleResolver = new requireDir();

module.exports = class Router {
  constructor(bot, pathToModules) {
    this.bot = bot;
    this.pathToModules = pathToModules;

    this.modules = {};
    this.overflowModules = {};
    this.reactionModules = {};

    // Register all modules. Not good lazy solution cuz of aliases for now...
    this.registerModules();
  }

  
  handle(data) {
    // Websocket starting up...
    if (data.type === 'hello') {
      return;
    }

    // Handle reactions
    if (data.type === 'reaction_added') {
      this.handleReaction(data);
      return;
    }

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

      if (config.getKey('modules_blacklist') && config.getKey('modules_blacklist').indexOf(key) === 0) {
        console.log("Skipping: ", key, " in blacklist.");
        return;
      }
      
      // Add all modules types to cmd array.  
      if (moduleObj.getType() === BaseModule.TYPES.MODULE) {       
        this.modules[key] = moduleObj;
        moduleObj.aliases().map(alias => {
          this.modules[alias] = moduleObj;
        }); 
      }

      // Overflow modules
      if (moduleObj.getType() === BaseModule.TYPES.OVERFLOW_CMD) {        
        this.overflowModules[key] = moduleObj;
      }

      // Reaction modules.
      if (moduleObj.getType() === BaseModule.TYPES.REACTIONS) {
        this.reactionModules[key] = moduleObj;
      }      

    });
  }

  handleReaction(data) {    
    Object.keys(this.reactionModules).forEach(key => {
      this.reactionModules[key].handle(data, this.modules);
    });
  }

  handleCmdMessage(data) {
    const matches = this.addExtras(data);
    if (data.cmd && data.cmd === "cmds") {
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

  showCmds(data) {
    let list = "";
    Object.keys(this.modules).forEach((key, idx) => {
      list += (idx+1) + ". " + key + "\n";
    });
    this.bot.postMessage(data.channel, "List of cmds:\n```" + list + "```");
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
