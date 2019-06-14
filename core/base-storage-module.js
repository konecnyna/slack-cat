'use strict';
const Sequelize = require('sequelize');
module.exports = class BaseStorageModule extends BaseModule {
  constructor(bot) {
    super(bot);
    if (new.target === BaseStorageModule) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }

    this.Sequelize = Sequelize;
    this.db = database;
    if (this.registerSqliteModel === undefined) {
      throw new TypeError('Child class must implement `registerSqliteModel()` method');
    } else {
      this.registerSqliteModel();
    }
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
  }
};
