'use strict';
const Pair = require('./Pair');
const CronJob = require('cron').CronJob;
const pair = new Pair();
const mixerConfig = config.getKey('mixercat');


module.exports = class MixerCat extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    if (mixerConfig.cron) {
      new CronJob(
        mixerConfig.cron,
        () => {
          this.pairPeople();
        },
        null,
        true,
        'America/New_York'
      );  
    } else {
      console.error("No cron given for mixercat");
    }        
  }

  async handle(data) {
    this.pairPeople();
  }

  async pairPeople() {
    const channelData = await this.bot.getChannelById(mixerConfig.channel);
    const members = channelData.members.filter(it => {
      return it !== this.bot.botInfo.id;
    });

    if (!members) {
      return false;
    }

    const matches = await pair.pairMembers(members, this.MixerCatModel);    
    matches.forEach(it => {
      if (it.length) {
        this.bot.postMessageToUsers(it, mixerConfig.match_message || "Hey you two time to get some coffee!");
      }
    });

    this.bot.postMessage(
      mixerConfig.channel,
      "I've just paired everyone for the week! Have fun! :smile:"
    );
  }

  registerSqliteModel() {
    this.MixerCatModel = this.db.define('mixer-meetings', {
      memberOne: { type: this.Sequelize.STRING, primaryKey: true },
      memberTwo: { type: this.Sequelize.STRING, primaryKey: true },
    });
  }

  getType() {
    return [BaseModule.TYPES.SERVICE, BaseModule.TYPES.MODULE];
  }

  help() {
    return 'Get paired with a random person for coffee!';
  }
};
