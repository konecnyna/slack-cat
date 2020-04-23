"use strict";
const pdUtil = new (require("./pager-duty-util"))();
const PdDialog = require("./pager-duty-dialog");
const CronJob = require("cron").CronJob;

module.exports = class PagerDuty extends BaseModule {
  constructor(bot) {
    super(bot);
    const { teams } = config.getKey("pager_duty_api");
    if (teams) {
      this.setupCron(teams);
      this.pdDialog = new PdDialog(bot, pdUtil);
    }
  }

  async handle(data) {
    if (!this.isValidConfig()) {
      this.bot.postMessage(
        data.channel,
        "Please add key `pager_duty_api` key to `config.json`"
      );
      return;
    }

    if (!data.user_text.length) {
      pdUtil.postBadInputError(this.bot, data);
      return;
    }

    const { teams } = config.getKey("pager_duty_api");
    const result = teams.find(it => it.team_name === data.user_text.trim());
    if (!result) {
      this.bot.postMessage(data.channel, "Couldn't find that team!");
      return;
    }

    this.postToChannel(result.policy_id, data.channel);
  }

  async handleCron() {
    const { teams } = config.getKey("pager_duty_api");
    teams
      .filter(team => {
        return team.channel_id && !team.cron;
      })
      .forEach(it => {
        this.postToChannel(it.policy_id, it.channel_id);
      });
  }

  async postToChannel(policy_id, channel) {
    const scheduleGroups = await pdUtil.getData(policy_id);

    const title = scheduleGroups[0].escalation_policy.summary;
    const fields = scheduleGroups.map(escalation => {
      return {
        level: escalation.escalation_level,
        title: "Level " + escalation.escalation_level,
        value: escalation.user.summary,
        short: false
      };
    });
    pdUtil.postFieldsToChannel(this.bot, channel, title, fields);
  }

  isValidConfig() {
    return (
      config.getKey("pager_duty_api") && config.getKey("pager_duty_api").key
    );
  }

  setupCron(teams) {
    teams.filter(it => it.cron).map(team => {
      new CronJob(
        team.cron,
        () => {
          this.postToChannel(team.policy_id, team.channel_id);
        },
        null,
        true,
        "America/New_York"
      );
    });

    new CronJob(
      "00 00 10 * * 1,2,3,4,5",
      () => {
        this.handleCron();
      },
      null,
      true,
      "America/New_York"
    );
  }

  createRoutes(app) {
    this.pdDialog.createRoutes(app, this.showDialog);
  }

  async onDialogSubmit(body) {
    console.log("!!!!!!!!!!!")
    this.pdDialog.onDialogSubmit(body);
  }

  dialogCallbackId() {
    return this.pdDialog.DIALOG_ID;
  }

  aliases() {
    return ["oncall"];
  }

  getType() {
    return [
      BaseModule.TYPES.MODULE,
      BaseModule.TYPES.DIALOG
    ];
  }

  help() {
    return (
      "Usage `?oncallteam team_name`\nValid team_names : " +
      config.getKey("pager_duty_api")["teams"].map(obj => obj.team_name)
    );
  }
};
