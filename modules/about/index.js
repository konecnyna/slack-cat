'use strict';

module.exports = class About extends BaseModule {
	handle(data) {
		const fields = [
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
				value:
					'https://github.com/konecnyna/slack-cat/blob/master/README.md',
				short: false,
			},

			{
				title: 'Help:',
				value: 'List of commands - `?cmds`\nHelp - `?<module_name> --help`',
				short: false,
			}
		];

		this.postFancyMessage(data.channel, fields);
	}

	async postFancyMessage(channel, fields) {
		this.bot.postRawMessage(channel, {
			icon_emoji: ':cat:',
			username: 'slackcat',
			attachments: [
				{
					color: '#36a64f',
					fields: fields,
					footer: 'meow',
				},
			],
		});
	}

	aliases() {
		return ['source'];
	}

	help() {
		return 'Shows you kewl info about the author(s)';
	}
};
