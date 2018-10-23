'use strict';
const Pair = require('./Pair');
const CronJob = require('cron').CronJob;
const pair = new Pair();
const mixerConfig = config.getKey('mixercat');

const DEFAULT_PAIR_MESSAGE = `Hi! :cat:

I'm in charge of getting to know your teammates better by pairing you with other people in the mixer channel.

So schedule some time to grab :coffee: or :doughnut:.
`;

const DONE_PAIRING_MESSAGE =
  "I've just paired everyone for the week! Have fun! :smile:";

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
    }
  }

  async handleMemeberJoin(data) {
    const welcomeMessage = mixerConfig.welcome_message;

    if (welcomeMessage === null) {
      return;
    }

    const userData = await this.bot.userDataPromise(data.user);
    this.bot.postMessageToUser(userData.user.id, welcomeMessage);
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
    matches.forEach(async it => {
      if (it.length && it.length >= 2) {
        console.log(it);
        this.bot.postMessageToUsers(
          it,
          mixerConfig.match_message || `${DEFAULT_PAIR_MESSAGE}`
        );
      }
    });

    this.bot.postMessage(mixerConfig.channel, DONE_PAIRING_MESSAGE);
  }

  async getExtraInfo(it) {
    let memberOne = await this.bot.web.users.info({
      user: it[0],
    });
    memberOne = memberOne.user.profile;

    let memberTwo = await this.bot.web.users.info({
      user: it[1],
    });
    memberTwo = memberTwo.user.profile;

    if (memberOne.title && memberTwo.title) {
      return `${memberOne.real_name} has the title of ${memberOne.title}\n${
        memberTwo.real_name
      } has the title of ${memberTwo.title}`;
    }

    return '';
  }

  registerSqliteModel() {
    this.MixerCatModel = this.db.define('mixer-meetings', {
      memberOne: { type: this.Sequelize.STRING, primaryKey: true },
      memberTwo: { type: this.Sequelize.STRING, primaryKey: true },
    });
  }

  getType() {
    return [
      BaseModule.TYPES.SERVICE,
      BaseModule.TYPES.MEMBER_JOINED_CHANNEL      
    ];
  }

  getChannelId() {
    return mixerConfig.channel;
  }

  help() {
    return 'Get paired with a random person for coffee!';
  }
};
