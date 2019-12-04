const request = require("request");

const ICON = 'http://emojis.slackmojis.com/emojis/images/1467306358/628/pagerduty.png';
const USER_NAME = 'PagerDutyCat';
const ERRORS = {
  badInput: {
    code: "badInput",
    text: "Looks like you forgot your team name! Try `?oncall --help` to know more."
  }
};


module.exports = class PagerDutyUtil {

  getData(policies) {
    var options = {
      url: 'https://api.pagerduty.com/oncalls',
      headers: {
        Authorization: 'Token token=' + config.getKey('pager_duty_api').key,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.pagerduty+json;version=2',
      },
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
          console.error(error);
          return;
        }

        const json = JSON.parse(body);
        const policyGroups = {};
        json.oncalls.map(item => {
          for (var i = 0; i < policies.length; i++) {
            if (policies[i].policy_id === item.escalation_policy.id) {
              if (!policyGroups[policies[i].policy_id]) {
                policyGroups[policies[i].policy_id] = [];
              }

              policyGroups[policies[i].policy_id].push(item);
            }
          }
        });

        resolve(policyGroups);
      });
    });
  }

  makeFields(policy) {
    const map = {};
    policy.map(item => {
      const key = `Level: ${item.escalation_level}`;
      if (key in map) {
        map[key].value += ', ' + item.user.summary;
      } else {
        map[key] = {
          level: item.escalation_level,
          title: 'Level ' + item.escalation_level,
          value: item.user.summary,
          short: false,
        };
      }
    });

    return map;
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