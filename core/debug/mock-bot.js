'use strict';
var extend = require('extend');

const botParams = {
  icon_emoji: ':cat:',
  username: 'SlackCat',
};

module.exports = class MockBot {
  constructor() {
    this.name = 'defkon';
  }

  postMessage(channelId, msg) {
    this.msg = msg;
    // Set default bot params.
    if (this.callback) {
      this.callback(msg);
    } else {
      console.log(msg);
    }
  }

  postMessageToThread(id, text, ts, params) {
    if (this.callback) {
      this.callback(text);
    } else {
      console.log(text);
    }
  }

  postMessageWithParams(channelId, msg, params) {
    this.msg = msg;
    if (this.callback) {
      this.callback(msg);
    } else {
      console.log(msg);
    }
  }

  postFancyMessage(channel_id, icon_emoji, color, title, body, botParams) {
    var attachments = {
      icon_emoji: icon_emoji,
      attachments: [
        {
          color: color,
          title: title,
          text: body,
        },
      ],
    };

    var params = extend(
      {
        channel: channel_id,
        username: this.name,
      },
      botParams || {},
      attachments
    );

    this.postRawMessage(channel_id, params);
  }

  postRawMessage(channel_id, args) {
    var params = extend(
      {
        channel: channel_id,
        username: this.name,
      },
      args || {}
    );

    if (this.callback) {
      this.callback(params);
    }
    console.log(JSON.stringify(params, null, 2));
  }

  // Prob a better way of doing this? Handle all the request/async functions.
  setCallback(callback) {
    this.callback = callback;
  }

  postRawMessage(channel_id, args) {
    var params = extend(
      {
        channel: channel_id,
        username: this.name,
      },
      args || {}
    );

    if (this.callback) {
      return this.callback(params);
    }
    console.log(JSON.stringify(params, null, 2));
  }

  getUserNameFromId(user_id) {
    return this.getFakeUser();
  }

  async resolveUserNameFromId(user_id) {
    const randUserData = await this.userDataPromise(user_id);
    return randUserData.user.profile.display_name
      ? randUserData.user.profile.display_name
      : randUserData.user.profile.real_name;
  }

  userDataPromise(user_id) {
    return this.getFakeUser();
  }

  getFakeUser() {
    return {
      ok: true,
      user: {
        id: 'U7YMR8S3H',
        team_id: 'T7XPH1Q4V',
        name: 'testuser',
        deleted: false,
        color: '9f69e7',
        real_name: 'Nick ',
        tz: 'America/New_York',
        tz_label: 'Eastern Standard Time',
        tz_offset: -18000,
        profile: {
          real_name: 'Nick',
          display_name: 'defkon',
          avatar_hash: 'gf2cc379c725',
          first_name: 'Nick',
          last_name: 'Steve',
          real_name_normalized: 'Nick ',
          display_name_normalized: 'defkon',
          email: 'bewbs@gmail.com',
          image_24:
            'https://secure.gravatar.com/avatar/f2cc379c7255051132894d1daaf79ed5.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0012-24.png',
          image_32:
            'https://secure.gravatar.com/avatar/f2cc379c7255051132894d1daaf79ed5.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0012-32.png',
          image_48:
            'https://secure.gravatar.com/avatar/f2cc379c7255051132894d1daaf79ed5.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0012-48.png',
          image_72:
            'https://secure.gravatar.com/avatar/f2cc379c7255051132894d1daaf79ed5.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0012-72.png',
          image_192:
            'https://secure.gravatar.com/avatar/f2cc379c7255051132894d1daaf79ed5.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0012-192.png',
          image_512:
            'https://secure.gravatar.com/avatar/f2cc379c7255051132894d1daaf79ed5.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0012-512.png',
          team: 'T7XPH1Q4V',
        },
        is_admin: true,
        is_owner: true,
        is_primary_owner: true,
        is_restricted: false,
        is_ultra_restricted: false,
        is_bot: false,
        updated: 1510253033,
        is_app_user: false,
      },
    };
  }

  setModules(modules) {        
    this.modules = modules;
  }
};
