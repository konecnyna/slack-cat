'use strict';
const request = require('request');

const SCORE_URL = "http://www.nfl.com/liveupdate/scores/scores.json";

class Game {
	constructor(date, network, homeTeam, homeScore, awayTeam, awayScore) {
		this.date = date;
		this.network = network;
		this.homeTeam = homeTeam;
		this.homeScore = homeScore;
		this.awayTeam = awayTeam;
		this.awayScore = awayScore;
	}
}

module.exports = class Stock extends BaseModule {
  async handle(data) {
    const scores = await this.getScores(data.user_text);
    this.postScores(data, scores);
  }


  postScores(data, scores) {
    if (scores.length === 0) {
      this.bot.postMessage(data.channel, "I couldn't find anything!");
      return;
    }

  	const fields = [];

  	const isShort = scores.length !== 1;
  	scores.forEach(it => {
  		fields.push({
  			title: `${it.date.month} - ${it.date.day} - ${it.date.year} on ${it.network}`,
  			value: `*${it.homeTeam}* - ${it.homeScore}\n*${it.awayTeam}* - ${it.awayScore}\n${isShort ? "---------" : ""}`,
        	short: isShort
    	});
  	})

    this.bot.postRawMessage(data.channel, {
      icon_emoji: ":football:",
      username: 'NflCat',
      attachments: [
        {
          title: "Current Scores:",
          fields: fields,          
        },
      ],
    });
  }

  parseDate(key) {
  	if (!key) {
  		return;
  	}

  	const year = key.slice(0,4);
  	const month = key.slice(4,6);
  	const day = key.slice(6,8);

  	const date = new Date();
  	date.day = day;
  	date.month = month;
  	date.year = year;
  	
  	return date;
  }

  async getScores(userText) {
	const scores = await this.getData();
    
    const games = [];

    Object.keys(scores).forEach(it => {
    	const game = scores[it];

    	games.push(new Game(
    		this.parseDate(it),
    		game.media.tv,
    		game.home.abbr,
    		this.calcGameScore(game.home.score),
    		game.away.abbr,
    		this.calcGameScore(game.away.score)
    		));
    });

    if (userText) {
    	return games.filter(it => {
    		return it.homeTeam === userText.toUpperCase() ||
    		it.awayTeam === userText.toUpperCase();
    	});
    }

    return games;
  }

  calcGameScore(score) {
  	if (score.T !== null) {
  		return score.T;
  	}

  	return score["1"] + score["2"] + score["3"] + score["4"] + score["5"];
  }

  getData() {
    var options = {
      url: SCORE_URL,
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
          console.error(error);
          return;
        }
        
        resolve(JSON.parse(body));
      });
    });
  }



  help() {
    return 'Usage: `?nfl team` should output the current/final score.';
  }
};
