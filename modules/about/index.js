'use strict';
const AboutServer = require('./server');
const aboutServer = new AboutServer();
const publicIp = require('public-ip');

const SOURCE_MSG = [
  {
    title: 'Author(s):',
    value: 'defkon (https://github.com/konecnyna)',
    short: false,
  },
  {
    title: 'Source code:',
    value: 'https://github.com/konecnyna/slack-cat',
    short: false,
  },
  {
    title: 'Contributing:',
    value: 'https://github.com/konecnyna/slack-cat/blob/master/README.md',
    short: false,
  },

  {
    title: 'Help:',
    value: 'List of commands - `?cmds`\nHelp - `?<module_name> --help`',
    short: false,
  },
];

module.exports = class About extends BaseModule {
  async handle(data) {
    if (data.cmd === 'help' || data.cmd === 'commands' || data.cmd === 'cmds') {
      this.postFancyMessage(
        data.channel,
        await this.getHelpMessages(),
        'https://github.com/konecnyna/slack-cat/blob/master/README.md'
      );
      return;
    }

    this.postFancyMessage(data.channel, SOURCE_MSG, 'meow');
  }

  async postFancyMessage(channel, fields, footer) {
    this.bot.postRawMessage(channel, {
      icon_emoji: ':cat:',
      username: 'slackcat',
      attachments: [
        {
          color: '#36a64f',
          fields: fields,
          footer: footer,
        },
      ],
    });
  }

  async getHelpMessages() {
    const ip = config.getKey('host') || (await publicIp.v4());
    return [
      {
        title: 'Usage:',
        value:
          'Commands are always prefixed with `?` such as `?ping`. Simply type `?ping` in any channel that has Slackcat in it and Slackcat should return `pong`',
        short: false,
      },
      {
        title: 'Troubleshooting:',
        value: 'Issue: I typed a command and nothing happened?',
        short: true,
      },
      {
        title: 'Troubleshooting:',
        value:
          "Solution: Verify that slackcat is in the channel `/invite @slackcat`. Make sure the server hasn't crashed.",
        short: true,
      },
      {
        title: 'Help:',
        value: `List of commands - \`?cmds\` or http://${ip}/help\nHelp - \`?<module_name> --help\``,
        short: false,
      },
    ];
  }

  createRoutes(app) {
    app.get(`/help`, async (req, res) => {
      aboutServer.setModules(this.bot.modules);

      res.set({ 'content-type': 'text/html; charset=utf-8' });
      const page = await aboutServer.createPage();
      res.send(page);
    });
  }

  secretHash() {
    return null;
  }

  aliases() {
    return ['source', 'help', 'commands', 'cmds'];
  }

  getType() {
    return [BaseModule.TYPES.ENDPOINT, BaseModule.TYPES.MODULE];
  }

  help() {
    return 'Shows you kewl info about the author(s) and useful info how to use the cat.';
  }
};
