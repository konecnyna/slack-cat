const requireDir = require('./requiredir')
const moduleResolver = new requireDir()

module.exports = class ModuleLoader {
  constructor(bot, server, pathToModules) {
    this.bot = bot
    this.server = server
    this.pathToModules = pathToModules

    this.modules = {}
    this.overflowModules = {}
    this.reactionModules = {}
    this.messageEditedModules = {}
    this.memberJoinedModules = {}
    this.rawInputModules = {}
    this.dialogModules = {}
    this.serviceModules = {}
    this.messageActionModules = {}

    this.registerModules()
  }

  registerModules() {
    // Core modules
    const moduleKeys = moduleResolver.loadModules(this.pathToModules)
    for (const key in moduleKeys) {
      try {
        this.instantiateModule(moduleKeys[key], key)
      } catch (e) {
        console.error(key, (e && e.stack) || e)
      }
    }

    // Models are all loaded so now we sync the database models.
    database.sync()
  }


  instantiateModule(className, key) {
    const moduleObj = new className(this.bot)
    if (!moduleObj) {
      console.error('Failed to instaniate module: ' + key)
      return
    }

    if (
      config.getKey('modules_blacklist') &&
      config.getKey('modules_blacklist').includes(key)
    ) {
      console.log('Skipping: ', key, ' in blacklist.')
      return
    }

    if (moduleObj.getType().includes(BaseModule.TYPES.DIALOG)) {
      this.createRoutes(moduleObj)
      this.addModules(
        key,
        moduleObj,
        BaseModule.TYPES.DIALOG,
        this.dialogModules
      )
    } else if (moduleObj.getType().includes(BaseModule.TYPES.ENDPOINT)) {
      this.createRoutes(moduleObj)
    }

    if (moduleObj.getType().includes(BaseModule.TYPES.MESSAGE_ACTION)) {
      this.addModules(
        key,
        moduleObj,
        BaseModule.TYPES.MESSAGE_ACTION,
        this.messageActionModules
      )
    }

    // Add all modules types to cmd array.
    if (moduleObj.getType().includes(BaseModule.TYPES.MODULE)) {
      this.modules[key] = moduleObj
      moduleObj.aliases().map(alias => {
        if (this.modules[alias]) {
          console.error('************************************************')
          console.error('* Warning: Overwriting [' + alias + '] alias. *')
          console.error('************************************************')
        }
        this.modules[alias] = moduleObj
      })
    }

    this.addModules(
      key,
      moduleObj,
      BaseModule.TYPES.OVERFLOW_CMD,
      this.overflowModules
    )
    this.addModules(
      key,
      moduleObj,
      BaseModule.TYPES.REACTION,
      this.reactionModules
    )
    this.addModules(
      key,
      moduleObj,
      BaseModule.TYPES.MESSAGE_EDITED,
      this.messageEditedModules
    )
    this.addModules(
      key,
      moduleObj,
      BaseModule.TYPES.MEMBER_JOINED_CHANNEL,
      this.memberJoinedModules
    )
    this.addModules(
      key,
      moduleObj,
      BaseModule.TYPES.RAW_INPUT,
      this.rawInputModules
    )
    this.addModules(
      key,
      moduleObj,
      BaseModule.TYPES.SERVICE,
      this.serviceModules
    )
  }

  getModules() {
    return {
      modules: this.modules,
      overflowModules: this.overflowModules,
      reactionModules: this.reactionModules,
      messageEditedModules: this.messageEditedModules,
      memberJoinedModules: this.memberJoinedModules,
      rawInputModules: this.rawInputModules,
      dialogModules: this.dialogModules,
      serviceModules: this.serviceModules,
      messageActionModules: this.messageActionModules
    }
  }

  createRoutes(moduleObj) {
    if (!this.server) {
      return
    }
    moduleObj.createRoutes(this.server.app)
  }

  addModules(key, module, type, array) {
    if (module.getType().includes(type)) {
      array[key] = module
    }
  }
}
