'use strict';
const fs = require('fs');
const path = require('path');

module.exports = class Secrets {
  constructor() {
    const dir = path.join(__dirname + "/../", 'secrets.dat');
    const contents = fs.readFileSync(dir);
    this.secrets = JSON.parse(contents);
    
    if (!this.getKey('slack_api')) {
      throw new Error("Must provide slack api keys\n\n\n");
    }
  }

  getKey(key) {
    if (this.secrets[key]) {
      return this.secrets[key];
    }

    return false;
  }
};
