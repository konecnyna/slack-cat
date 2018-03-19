'use strict';
const fs = require('fs');
const path = require('path');

module.exports = class Config {
  constructor(configPath) {
    try {
      const contents = fs.readFileSync(configPath);
      this.config = JSON.parse(contents);  
    } catch (e) {
      this.config = {};
      console.error("Running without config.dat");
    }
    
  }

  getKey(key) {
    if (this.config[key]) {
      return this.config[key];
    }

    return false;
  }
};
