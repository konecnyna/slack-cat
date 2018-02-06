'use strict';

module.exports = class BaseStorageModule extends BaseModule {
  constructor(bot) {
    super(bot);
    if (new.target === BaseStorageModule) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }

    this.Sequelize = require('sequelize');        

    this.db = new this.Sequelize(null, null, null, {
      dialect: 'sqlite',
      storage: STORAGE_PATH, // global.
      logging: false,
      operatorsAliases: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

    if (this.registerSqliteModel === undefined) {
      throw new TypeError(
        'Child class must implement `registerSqliteModel()` method'
      );
    } else {
      this.registerSqliteModel();
    }

    this.db.sync();
  }

  async upsert(model, whereClause, data, update) {
    const obj = await model.findOne(whereClause);
    if (obj) {
      //update
      await model.update(update, whereClause);
      // return updated model.
      return await model.findOne(whereClause);
    } else {
      // insert
      return await model.create(data);
    }

    return {};
  }
};
