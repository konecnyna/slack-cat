'use strict';

const Mta = require('mta-gtfs');
const mtaKey = config.getKey('mta');
const mta = new Mta({
  key: mtaKey, 
});


module.exports = class MTA {
	async getStops() {
		// Gist of all the stations
		return "https://gist.github.com/konecnyna/07f0436ff8b4a89d9f814938b12a3c25";
		
		// const stops = await mta.stop();
	 //  	const output = Object.keys(stops).map(key => {
	 //  		const stop = stops[key];
	 //  		return `| ${stop.stop_id[0]} | ${stop.stop_name} |  ${stop.stop_id} |`
	 //  	});
	 //  	var fs = require('fs');
		// fs.writeFile("stops.txt", output.join("\n"), function(err) {
		//     if(err) {
		//         return console.log(err);
		//     }

		//     console.log("The file was saved!");
		// }); 
	}

	async status(input) {
		const status = await mta.status();
		return status.subway.filter(subway => {
			return subway.name.includes(input.toUpperCase());
		});
	}

	async getStopSchedule(stopId) {
		return await mta.schedule(stopId, this.getFeedId(stopId[0]));
	}

	async getStopName(stopId) {
		const stop = await mta.stop(stopId);
		return stop.stop_name;		
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