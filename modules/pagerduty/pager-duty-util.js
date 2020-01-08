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

  async getData(schedules) {
    const scheduleIds = schedules.map(it => {
      return it.schedule_id
    });

    const scheduleGroups = await this.getScheduleGroups(schedules, scheduleIds);
    // await this.addOverrides(scheduleGroups, scheduleIds)
    return scheduleGroups;
  }

  async getScheduleGroups(schedules, scheduleIds) {
    const options = {
      url: `https://api.pagerduty.com/oncalls?schedule_ids[]=${scheduleIds.join(",")}`,
      headers: {
        Authorization: 'Token token=' + config.getKey('pager_duty_api').key,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.pagerduty+json;version=2',
      },
      json: true
    };

    const { oncalls } = await request(options);
    const scheduleGroups = {};
    oncalls.forEach(item => {
      for (var i = 0; i < schedules.length; i++) {
        if (schedules[i].schedule_id === item.schedule.id) {
          if (!scheduleGroups[schedules[i].schedule_id]) {
            scheduleGroups[schedules[i].schedule_id] = [];
          }

          scheduleGroups[schedules[i].schedule_id].push(item);
        }
      }
    });
    return scheduleGroups;
  }

  async addOverrides(scheduleGroups, scheduleIds) {
    const overridePromises = scheduleIds.map(it => {
      return request({
        url: `https://api.pagerduty.com/schedules/${it}/overrides`,
        headers: {
          Authorization: 'Token token=' + config.getKey('pager_duty_api').key,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.pagerduty+json;version=2',
        },
        qs: {
          since: moment().toISOString(),
          until: moment().add(8, 'hours').toISOString(),
        },
        json: true
      });
    })

    const scheduleOverrides = await Promise.all(overridePromises)
    scheduleOverrides.forEach(scheduleOverride => {
      scheduleOverride.overrides.map((it, index) => {
        const id = scheduleIds[index];
        const schedule = scheduleGroups[id];
        it["escalation_level"] = `1 (override)`;
        schedule.push(it);
      });
    })
  }

  makeFields(schedule) {
    const map = {};
    schedule.map(({ escalation_policy }) => {
      const key = `Level: ${escalation_policy.escalation_level}`;
      console.log(key);
      // if (key in map) {
      //   map[key].value += ', ' + item.user.summary;
      // } else {
      //   map[key] = {
      //     level: item.escalation_level,
      //     title: 'Level ' + item.escalation_level,
      //     value: item.user.summary,
      //     short: false,
      //   };
      // }
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