'use strict';
const util = require('util');

module.exports = class HrViolations extends BaseStorageModule {

  async handle(data) {
    await this.replaceSlackUserWithUserName(data);
    if (data.cmd === "hrviolations") {

      this.displayHrviolations(data);
      return;
    }

    // Add violation.
    this.addViolation(data);
    this.bot.postMessage(data.channel, "Achievement unlocked: HR VIOLATION\nhttps://i.imgur.com/wjySGr5.png");
  }


  registerSqliteModel() {
    this.HrViolations = this.db.define('hrviolations', {
      name: this.Sequelize.STRING,
      reported_reason: this.Sequelize.STRING,
      reported_by: this.Sequelize.STRING,
    });
  }

  aliases() {
    return ['hrviolations'];
  }

  help() {
    return "";
  }

  async displayHrviolations(data) {
    if (!data.user_text) {
      this.getLeaderBoard(data);
      return;
    }

    const violations = await this.getViolations(data.user_text);
    if (violations) {
      this.bot.postMessage(data.channel, util.format("*%s* has %d reported violations", data.user_text, violations.length));
      return;
    }

    this.bot.postMessage(data.channel, "No reported HR Violations");
  }

  async getLeaderBoard(data) {
    const violations = await this.db.query(
      'select name, count(*) as number from hrviolations GROUP BY 1 order by number DESC', 
      { model: this.HrViolations }
    );
      
    let msg = "";
    violations.forEach( (violation, index) =>  {
      let row = util.format("*%d. %s* - %d violations\n", index + 1, violation.get('name'), violation.get('number'));
      msg += row;
    });

    this.bot.postMessageWithParams(data.channel, msg, {
      icon_emoji: ':oncoming_police_car:',
      username: 'HrViolations Leaderboard',
    });
  }

  async getViolations(keyword) {
    const hrviolations = await this.HrViolations.findAll({
      where: {
        name: keyword,
      }
    });

    const msgs = [];
    hrviolations.map(row => {
      msgs.push(row.get('reported_reason'));
    });
    
    return msgs;
  }

  async addViolation(data) {
    const split = data.user_text.split(' ');
    const authorData = await this.bot.userDataPromise(data.user);    

    const violationsData = {
      name: split[0].trim(),
      reported_reason: split.splice(1, split.length).join(' '),
      reported_by: authorData.user.name,
    };

    this.HrViolations.create(violationsData);      
  }
};
