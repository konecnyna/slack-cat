const request = require('request-promise');
const ICON = 'http://emojis.slackmojis.com/emojis/images/1467306358/628/pagerduty.png';
const USER_NAME = 'PagerDutyCat';
const ERRORS = {
  badInput: {
    code: "badInput",
    text: "Looks like you forgot your team name! Try `?oncall --help` to know more."
  }
};

const HEADER = {
  Authorization: 'Token token=' + config.getKey('pager_duty_api').key,
  'Content-Type': 'application/json',
  Accept: 'application/vnd.pagerduty+json;version=2',
}


module.exports = class PagerDutyUtil {

  async getData(escalationPolicyId) {
    const scheduleGroups = await this.getScheduleGroups(escalationPolicyId);
    return scheduleGroups;
  }

  async getPdUser(id) {
    const options = {
      url: `https://api.pagerduty.com/users/${id}`,
      headers: {
        Authorization: 'Token token=' + config.getKey('pager_duty_api').key,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.pagerduty+json;version=2',
      },
      json: true
    };

    return await request(options);
  }

  async getScheduleGroups(escalationPolicyId) {
    const options = {
      url: `https://api.pagerduty.com/oncalls?include[]=escalation_policies&escalation_policy_ids[]=${escalationPolicyId}`,
      headers: HEADER,
      json: true
    };

    const { oncalls } = await request(options);
    return oncalls;
  }

  postFieldsToChannel(bot, channel, title, fields) {
    bot.postRawMessage(channel, {
      icon_url: ICON,
      username: USER_NAME,
      attachments: [
        {
          color: '#048A24',
          author_icon: 'https://i.imgur.com/HKOY97q.png',
          title: title,
          fields: Object.values(fields).sort((a, b) => { return b.level - a.level }),
          footer: ':fire: lets hope nothings on fire :fire:',
        },
      ],
    });
  }

  postBadInputError(bot, data) {
    bot.postMessageWithParams(data.channel, ERRORS.badInput.text, {
      icon_url: ICON,
      username: USER_NAME,
    });
  }


  async listTeams() {
    const options = {
      url: `https://api.pagerduty.com/teams`,
      headers: HEADER,
      json: true
    };

    const { teams } = await request(options);
    return teams;
  }

  async createIncident() {
    const incident = {
      "incident": {
        "type": "incident",
        "title": "Slackcat Invoked Incident",
        "service": {
          "type": "service_reference"
        },
        "urgency": "high",
        "body": {
          "type": "incident_body",
          "details": "A disk is getting full on this machine. You should investigate what is causing the disk to fill, and ensure that there is an automated process in place for ensuring data is rotated (eg. logs should have logrotate around them). If data is expected to stay on this disk forever, you should start planning to scale up to a larger disk."
        },
        "escalation_policy": {
          "id": "PZROBGA",
          "type": "escalation_policy_reference"
        }
      }
    }

    const options = {
      url: `https://api.pagerduty.com/incidents`,
      headers: HEADER,
      method: "POST",
      json: true
    };

    const response = await request(options);
    console.log(response);
  }
}