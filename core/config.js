'use strict';
const fs = require('fs');
const path = require('path');

module.exports = class Config {
  constructor(configPath) {
    console.log(configPath, "hi");
    const contents = fs.readFileSync(configPath);
    this.config = JSON.parse(contents);
    
    if (!this.getKey('slack_api')) {
      throw new Error("Must provide slack api keys\n\n\n");
    }
  }

  getKey(key) {
    if (this.config[key]) {
      return this.config[key];
    }

    return false;
  }
};
