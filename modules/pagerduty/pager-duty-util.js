const request = require('request-promise');
const moment = require('moment');
const queryString = require('query-string');

const ICON = 'http://emojis.slackmojis.com/emojis/images/1467306358/628/pagerduty.png';
const USER_NAME = 'PagerDutyCat';
const ERRORS = {
  badInput: {
    code: "badInput",
    text: "Looks like you forgot your team name! Try `?oncall --help` to know more."
  }
};


module.exports = class PagerDutyUtil {

  async getData(escalationPolicyId) {
    const scheduleGroups = await this.getScheduleGroups(escalationPolicyId);
    return scheduleGroups;
  }

  async getScheduleGroups(escalationPolicyId) {
    const options = {
      url: `https://api.pagerduty.com/oncalls?include[]=escalation_policies&escalation_policy_ids[]=${escalationPolicyId}`,
      headers: {
        Authorization: 'Token token=' + config.getKey('pager_duty_api').key,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.pagerduty+json;version=2',
      },
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
          color: '#36a64f',
          author_icon: 'https://cdn6.aptoide.com/imgs/9/6/a/96ac16c7e70a7cf636ad85f8b5c7d5b2_icon.png?w=256',
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
}