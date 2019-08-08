'use strict';
const request = require('request');

module.exports = class PagerDuty extends BaseModule {
  async handle(data) {
    if (!this.isValidConfig()) {
      this.bot.postMessage(
        data.channel,
        'Please add key `pager_duty_api` key to `config.json`'
      );
      return;
    }

    const body = await this.getData(config.getKey('pager_duty_api').policies);
    Object.keys(body).map(key => {
      const fields = this.makeFields(body[key]);
      const title = body[key][0].escalation_policy.summary;
      this.postFieldsToChannel(data.channel, title, fields);
    })
    
  }

  help() {
    return 'Pager duty command will return the on call list.';
  }

  isValidConfig() {
    return (
      config.getKey('pager_duty_api') &&
      config.getKey('pager_duty_api').key &&
      config.getKey('pager_duty_api').policies.length
    );
  }

  postFieldsToChannel(channel, title, fields) {
    this.bot.postRawMessage(channel, {
      icon_url:
        'http://emojis.slackmojis.com/emojis/images/1467306358/628/pagerduty.png',
      username: 'PagerDutyCat',
      attachments: [
        {
          color: '#36a64f',
          author_icon:
            'https://cdn6.aptoide.com/imgs/9/6/a/96ac16c7e70a7cf636ad85f8b5c7d5b2_icon.png?w=256',
          title: title,
          fields: Object.values(fields).sort((a,b) => { return b.level - a.level }),
          footer: ':fire: lets hope nothings on fire :fire:',
        },
      ],
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

  aliases() {
    return ['oncall'];
  }
};
