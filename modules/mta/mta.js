'use strict';

const Mta = require('mta-gtfs');
const mta = new Mta({
  key: '2dd40d377edde733d34cab03c597a670', // only needed for mta.schedule() method  
});

module.exports = class MTA {
	constructor() {

      
	
	
	//console.log(query[0]);

	//const stops = await mta.stop();
  	//console.log(stops);	

    	// console.log(await mta.schedule('636'));
            
    	// console.log(this.getFeedId("F"));

	}


	async status(input) {
		const status = await mta.status();
		return status.subway.filter(subway => {
			return subway.name.includes(input.toUpperCase());
		});
	}



	getSubwayColor(train) {

		if (this.matchSubway(train, "123")) {
			return "#F44336";	
		} else if (this.matchSubway(train, "456")) {
			return "#4CAF50";
		} else if (this.matchSubway(train, "7")) {
			return "#9C27B0";
		} else if (this.matchSubway(train, "ACE")) {
			return "#3F51B5";
		} else if (this.matchSubway(train, "BDFM")) {
			return "#FF9800";
		} else if (this.matchSubway(train, "JZ")) {
			return "#795548";
		} else if (this.matchSubway(train, "G")) {
			return "#00E676";
		} else if (this.matchSubway(train, "L")) {
			return "grey";
		} else if (this.matchSubway(train, "NQR")) {
			return "#FFC107";
		} else if (train === "S") { // False positive for SIR so check here.
			return "#9E9E9E";
		} else if (train === "SIR") {
			return "#0D47A1";
		}

		return "transparent";
	}

	matchSubway(train, line) {
		return line.includes(train) || train === line;
	}

	getFeedId(input) {
		if ("123456S".includes(input)) {
			return 1;
		}

		if ("ACE".includes(input)) {
			return 26;
		}

		if ("NQRW".includes(input)) {
			return 16;
		}

		if ("BDFM".includes(input)) {
			return 21;
		}

		if ("L".includes(input)) {
			return 2;
		}

		if ("G".includes(input)) {
			return 31;
		}

		if ("JZ".includes(input)) {
			return 36;
		}

		if ("7".includes(input)) {
			return 51;
		}

	}
}