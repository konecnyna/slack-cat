'use strict';
const pdUtil = new (require('./pager-duty-util'))();
const CronJob = require('cron').CronJob

module.exports = class PagerDuty extends BaseModule {
  constructor(bot) {
    super(bot);
    new CronJob(
      "00 00 10 * * 1,2,3,4,5",
      () => {
        this.postToChannel("", "");
      },
      null,
      true,
      "America/New_York"
    );
  }

  async handle(data) {
    if (!this.isValidConfig()) {
      this.bot.postMessage(
        data.channel,
        'Please add key `pager_duty_api` key to `config.json`'
      );
      return;
    }

    if (!data.user_text.length) {
      pdUtil.postBadInputError(this.bot, data);
      return;
    }

    this.postToChannel(data.user_text, data.channel);
  }

  async postToChannel(dataTeamName, channel) {
    const { teams } = config.getKey('pager_duty_api')
    const scheduleGroups = await pdUtil.getData(teams);
    console.log(JSON.stringify(scheduleGroups, null, 2));
    Object.keys(scheduleGroups).forEach(scheduleKey => {
      const channelId = teams.find(team => team.schedule_id === scheduleKey)
      const fields = pdUtil.makeFields(scheduleGroups[scheduleKey]);
      // console.log(fields)
      // const title = oncall[0].escalation_policy.summary;
      // pdUtil.postFieldsToChannel(this.bot, channelId, title, fields);
    })
    // pager_duty_api_json_obj["teams"].map(async it => {
    //   // team_name and channel_name will be blank for cron job.
    //   // Hence post the list to the channel_id, configured in config.json
    //   var channelName = channel
    //   if (channel === "") {
    //     channelName = it.channel_id
    //   }

    //   // Either team_name should be blank i.e. cron job is executing OR
    //   // team_name matches with the argument passed with the command, to print oncall for that team only.
    //   if (dataTeamName === "" || dataTeamName === it.team_name) {
    //     const body = await pdUtil.getData([it]);
    //     const oncall = body[it.policy_id];
    //     const fields = pdUtil.makeFields(oncall);
    //     const title = oncall[0].escalation_policy.summary;
    //     pdUtil.postFieldsToChannel(this.bot, channelName, title, fields);
    //   }
    // });
  }

  isValidConfig() {
    return (
      config.getKey('pager_duty_api') &&
      config.getKey('pager_duty_api').key
    );
  }

  aliases() {
    return ['oncall'];
  }


  help() {
    return "Usage `?oncallteam team_name`\nValid team_names : " + config.getKey('pager_duty_api')["teams"].map(obj => obj.team_name);
  }
};
