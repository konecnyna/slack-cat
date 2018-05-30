'use strict';

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

const HELP_MSG = [
  {
    title: 'Help:',
    value: 'List of commands - `?cmds`\nHelp - `?<module_name> --help`',
    short: false,
  },
  {
    title: 'Usage:',
    value: 'Commands are always prefixed with `?` such as `?ping`. Simply type `?ping` in any channel that has Slackcat in it and Slackcat should return `pong`',
    short: false,
  },
  {
    title: 'Troubleshooting:',
    value: 'Issue: I typed a command and nothiing happened?',
    short: true,
  },
  {
    title: 'Troubleshooting:',
    value: 'Solution: Verify that slackcat is in the channel `/invite @slackcat`. Make sure the server hasn\'t crashed.',
    short: true,
  },
];

module.exports = class About extends BaseModule {
  handle(data) {
    if (data.cmd === 'help') {
      this.postFancyMessage(data.channel, HELP_MSG, 'https://github.com/konecnyna/slack-cat/blob/master/README.md');
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

  aliases() {
    return ['source', 'help'];
  }

  help() {
    return 'Shows you kewl info about the author(s) and useful info how to sue the cat.';
  }
};
