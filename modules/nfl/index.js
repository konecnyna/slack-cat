'use strict';
const request = require('request');

const SCORE_URL = 'https://feeds.nfl.com/feeds-rs/scores.json';

class Game {
  constructor(date, homeTeam, homeScore, awayTeam, awayScore, time) {
    this.date = date;
    this.homeTeam = homeTeam;
    this.homeScore = homeScore;
    this.awayTeam = awayTeam;
    this.awayScore = awayScore;
    this.time = time;
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
        title: `${it.date}`,
        value: `*${it.homeTeam}* - ${it.homeScore}\n*${it.awayTeam}* - ${
          it.awayScore
        }\n${it.time}\n${isShort ? '---------' : ''}`,
        short: isShort,
      });
    });

    this.bot.postRawMessage(data.channel, {
      icon_emoji: ':football:',
      username: 'NflCat',
      attachments: [
        {
          color: '#0D47A1',
          title: 'Current Scores:',
          fields: fields,
        },
      ],
    });
  }

  parseDate(key) {
    if (!key) {
      return;
    }

    const year = key.slice(0, 4);
    const month = key.slice(4, 6);
    const day = key.slice(6, 8);

    const date = new Date();
    date.day = day;
    date.month = month;
    date.year = year;

    return date;
  }

  async getScores(userText) {
    const scores = await this.getData();

    const games = [];

    scores.gameScores.forEach(it => {
      games.push(
        new Game(
          it.gameSchedule.gameDate,
          it.gameSchedule.homeTeam.abbr,
          it.score.visitorTeamScore.pointTotal,
          it.gameSchedule.visitorTeam.abbr,
          it.score.homeTeamScore.pointTotal,
          this.resolvePhase(it.score)
        )
      );
    });

    if (userText) {
      return games.filter(it => {
        return (
          it.homeTeam === userText.toUpperCase() ||
          it.awayTeam === userText.toUpperCase()
        );
      });
    }

    return games;
  }

  resolvePhase(score) {
    if (score.phase === 'FINAL') {
      return score.phase;
    }

    return `${score.phase} - ${score.time}`;
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
