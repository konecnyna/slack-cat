'use strict';
const JiraApi = require('jira-client');
const jiraSecrets = config.getKey('jira_api');
const jira = new JiraApi({
  protocol: 'https',
  host: jiraSecrets.host,
  username: jiraSecrets.username,
  password: jiraSecrets.password,
  apiVersion: '2',
  strictSSL: true,
});
const QUOTES_REGEX = new RegExp('("([^"]|"")*")', 'g');
const JiraCreate = require('./jira-create');
const CALLBACK_ID = 'submit-jira-ticket';

module.exports = class Jira extends BaseModule {
  constructor(bot) {
    super(bot);
    this.jiraCreate = new JiraCreate(this);
  }

  async handle(data) {
    // Initialize
    if (!jiraSecrets) {
      this.bot.postMessage(
        data.channel,
        "Please add ```'jira_api': {\n\
        'host': 'mykewlhost.org',\n\
        'username': 'user@kewldomain.com',\n\
        'password': 'xxxxxxxxxxx'\n\
        }``` to `config.json`"
      );
      return;
    }

    if (!data.user_text) {
      this.displayHelp(data);
      return;
    }

    if (data.cmd === 'jira-tix') {
      const jql = `assignee = ${data.user_text} AND status in ('In Progress')`;
      const searchResults = await jira.searchJira(jql, { maxResults: 10 });
      this.postUserTix(data, searchResults);
      return;
    }

    try {
      const issue = await this.logIssueName(data.user_text);
      this.sendJiraStatus(data, issue);
    } catch (e) {
      console.log(e);
      this.bot.postMessage(
        data.channel,
        "Couldn't find anything matching: " + data.user_text
      );
    }
  }

  displayHelp(data) {
    this.bot.postMessage(data.channel, this.help());
  }

  postUserTix(data, searchResults) {
    const tix = searchResults.issues.map(issue => {
      return `${issue.key} - https://${jiraSecrets.host}/browse/${issue.key}`;
    });
    this.bot.postRawMessage(data.channel, {
      icon_emoji: ':cat:',
      username: 'JiraCat',
      attachments: [
        {
          color: '#6338aa',
          fields: [
            {
              title: `In progress tickets for ${data.user_text}`,
              value: tix.join('\n'),
              short: false,
            },
          ],
          footer: 'jira... amirite?',
        },
      ],
    });
  }

  sendJiraStatus(data, issue) {
    const fields = [
      {
        title: 'Assignee:',
        value: issue.fields.assignee.displayName,
        short: true,
      },
      {
        title: 'Status:',
        value: issue.fields.status.name,
        short: true,
      },
      {
        title: 'Issue:',
        value: `https://${jiraSecrets.host}/browse/${issue.key}`,
        short: false,
      },
    ];

    this.bot.postRawMessage(data.channel, {
      icon_emoji: ':cat:',
      username: 'JiraCat',
      attachments: [
        {
          color: '#6338aa',
          title: issue.key + ': ' + issue.fields.summary,
          fields: fields,
          footer: 'jira... amirite?',
        },
      ],
    });
  }

  async onDialogSubmit(body) {
    const newIssue = await this.jiraCreate.createJiraTicket(body, jira);
    this.postIssue(body.user.id, newIssue);
  }

  dialogCallbackId() {
    return CALLBACK_ID;
  }

  createRoutes(app) {
    this.jiraCreate.createRoutes(app, CALLBACK_ID);
  }

  async postIssue(channel, issue) {
    const userData = await this.bot.userDataPromise(channel);
    this.bot.postMessageToUser(
      userData.user.name,
      `Created: ${issue.key}. See: https://${jiraSecrets.host}/browse/${
        issue.key
      }`,
      {}
    );
  }

  async logIssueName(issueNumber) {
    try {
      return await jira.findIssue(issueNumber);
    } catch (err) {
      throw err;
    }
  }

  getType() {
    return [
      BaseModule.TYPES.MODULE,
      BaseModule.TYPES.DIALOG,
      BaseModule.TYPES.ENDPOINT,
    ];
  }

  help() {
    return 'Usage:\n`?jira <ticket-number>`.\n`\\jira-create`';
  }

  aliases() {
    return ['jira-tix'];
  }
};
