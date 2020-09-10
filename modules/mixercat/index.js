'use strict'
const Pair = require('./Pair')
const CronJob = require('cron').CronJob
const pair = new Pair()

const DEFAULT_PAIR_MESSAGE = `Hi! :cat:

I'm in charge of getting to know your teammates better by pairing you with other people in the mixer channel.

So schedule some time to grab :coffee: or :doughnut:.
`

const DONE_PAIRING_MESSAGE =
  "I've just paired everyone for the week! Have fun! :smile:"

module.exports = class MixerCat extends BaseStorageModule {
  constructor(bot) {
    super(bot)
    if (this.getConfig().cron) {
      new CronJob(
        this.getConfig().cron,
        () => {
          this.pairPeople()
        },
        null,
        true,
        'America/New_York'
      )
    }
  }

  async handle(data) {
    this.pairPeople(data.channel)
  }

  async handleMemberJoin(data) {
    const welcomeMessage = this.getConfig().welcome_message

    if (welcomeMessage === null) {
      return
    }
    const userData = await this.bot.userDataPromise(data.user)
    this.bot.postMessageToUser(userData.user.id, welcomeMessage)
  }

  async pairPeople(channel) {
    try {
      const members = await this.bot.getChannelMembers(channel)
      const filteredMembers = members.filter(it => {
        return it !== this.bot.botInfo.id
      })

      const matches = await pair.pairMembers(filteredMembers, this.MixerCatModel)
      matches.forEach(async it => {
        if (it.length && it.length >= 2) {
          this.bot.postMessageToUsers(
            it,
            this.getConfig().match_message || `${DEFAULT_PAIR_MESSAGE}`
          )
        }
      })

      this.bot.postMessage(channel, DONE_PAIRING_MESSAGE)
    } catch (e) {
      this.bot.postMessage(channel, ` 🚨 Pairing failed! 🚨\nError: ${e.message}`)
      console.trace(e);
    }
  }

  async getExtraInfo(it) {
    let member_one = await this.bot.web.users.info({
      user: it[0]
    })
    member_one = member_one.user.profile

    let member_two = await this.bot.web.users.info({
      user: it[1]
    })
    member_two = member_two.user.profile

    if (member_one.title && member_two.title) {
      return `${member_one.real_name} has the title of ${member_one.title}\n${
        member_two.real_name
        } has the title of ${member_two.title}`
    }

    return ''
  }

  registerSqliteModel() {
    this.MixerCatModel = this.db.define('mixer_meetings', {
      member_one: { type: this.Sequelize.STRING, primaryKey: true },
      member_two: { type: this.Sequelize.STRING, primaryKey: true }
    }, { timestamps: false });
  }

  getType() {
    return [BaseModule.TYPES.MODULE, BaseModule.TYPES.SERVICE, BaseModule.TYPES.MEMBER_JOINED_CHANNEL]
  }

  getConfig() {
    return config.getKey('mixercat')
  }

  getChannelId() {
    return this.getConfig().channel
  }

  help() {
    return 'Get paired with a random person for coffee!'
  }
}
