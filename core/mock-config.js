'use strict';
module.exports = class Config {

	constructor() {
		this.blacklist = [];
	}

  	getKey(key) {  	
  	
  		if (key === "modules_blacklist") {
  			return this.blacklist;
  		}

    	return true;
  	}
};
