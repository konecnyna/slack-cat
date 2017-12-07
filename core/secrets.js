'use strict';
const fs = require('fs');

module.exports = class Secrets {
  constructor() {
    const contents = fs.readFileSync(__dirname + '/../secrets.dat');
    this.secrets = JSON.parse(contents);
    
    if (!this.getKey('slackapi')) {
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
