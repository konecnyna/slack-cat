"use strict";
const pdUtil = new (require("./pager-duty-util"))();
const PdDialog = require("./pager-duty-dialog");
const CronJob = require("cron").CronJob;
const ICON = 'http://emojis.slackmojis.com/emojis/images/1467306358/628/pagerduty.png';
const USER_NAME = 'PagerDutyCat';

module.exports = class PagerDuty extends BaseModule {
  constructor(bot) {
    super(bot);
    const teams = this.provideTeams()
    if (teams) {
      this.setupCron(teams);
    }

    this.pdDialog = new PdDialog(bot, pdUtil);
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
      this.bot.postMessageWithParams(data.channel, `Looks like you forgot your team name!\n${this.help()}`, {
        icon_url: ICON,
        username: USER_NAME,
      });
      return;
    }

    const teams = this.provideTeams()
    const result = teams.find(it => it.team_name.toLowerCase() === data.user_text.trim().toLowerCase());
    if (!result) {
      const teamNames = teams.map(
        (obj) => `• ${obj.team_name} <#${obj.channel_id}>`
      );
      this.bot.postMessage(
        data.channel,
        `Couldn't find that team! Teams list:\n${teamNames.join('\n')}`
      );
      return;
    }

    this.postToChannel(result.policy_id, data.channel);
  }

  async handleCron() {
    const teams = this.provideTeams()
    teams
      .filter(team => {
        return team.channel_id && !team.cron;
      })
      .forEach(it => {
        this.postToChannel(it.policy_id, it.channel_id);
      });
  }

  async postToChannel(policy_id, channel) {
    try {
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
    } catch (e) {
      const errorChannel = this.provideErrorChannel()
      if (!errorChannel) {
        console.log(e``)
        return;
      }

      this.bot.postRawMessage(errorChannel, {
        icon_url: pdUtil.slackIcon,
        username: pdUtil.slackUserName,
        attachments: [
          {
            color: '#D32F2F',
            author_icon: 'https://i.imgur.com/HKOY97q.png',
            title: "🚨 Error 🚨",
            fields: [
              {
                title: `Failed to find policy id: ${policy_id}`,
                value: `${e.message}`,
                short: false,
              }],
            footer: ':fire: lets hope nothings on fire :fire:',
          },
        ],
      })
    }
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
    await this.pdDialog.onDialogSubmit(body);
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

  provideTeams() {
    const { teams } = config.getKey("pager_duty_api");
    return teams;
  }

  provideErrorChannel() {
    return null;
  }

  help() {
    const teams = this.provideTeams().map(
      (obj) => `• ${obj.team_name} <#${obj.channel_id}>`
    );
    return 'Usage `?oncall team_name`\nValid team names:\n' + teams.join('\n');
  }
};
