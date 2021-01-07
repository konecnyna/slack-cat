'use strict';

module.exports = class Config {
  constructor() {
    try {
      const contents = process.env.SECRETS;
      this.config = JSON.parse(contents);
    } catch (e) {
      this.config = {};
      console.error('Running without config.json', e);
    }
  }

  getKey(key) {
    if (this.config[key]) {
      return this.config[key];
    }

    return false;
  }
};
