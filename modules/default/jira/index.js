'use strict';
const JiraApi = require('jira-client');
const jiraSecrets = secrets.getKey('jira_api');
const jira = new JiraApi({
	protocol: 'https',
	host: jiraSecrets.host,
	username: jiraSecrets.username,
	password: jiraSecrets.password,
	apiVersion: '2',
	strictSSL: true,
});

module.exports = class Jira extends BaseModule {
	async handle(data) {
		// Initialize
		if (!jiraSecrets) {
			this.bot.postMessage(
				data.channel,
				"Please add ```'jira_api': {\n\
    		'host': 'stashinvest.atlassian.net',\n\
    		'username': 'nkonecny@stashinvest.com',\n\
    		'password': 'crossword1'\n\
    		}``` to `secrets.dat`"
			);
			return;
		}

		if (!data.user_text) {
			this.bot.postMessage(data.channel, this.help());
			return;
		}


		try {
			const issue = await this.logIssueName(data.user_text);
			this.sendJiraStatus(data, issue);
		} catch (e) {
			this.bot.postMessage(data.channel, "Couldn't find anything matching: " + data.user_text);
		}	
	}

	sendJiraStatus(data, issue) {
		const fields = [
			{
	            "title": "Assignee:",
	            "value": issue.fields.assignee.displayName,
	            "short": true
        	},
	        {
	            "title": "Status:",
	            "value": issue.fields.status.name,
	            "short": true
        	},
    		{	
	            "title": "Issue:",
	            "value": issue.self,
	            "short": false
	        }
		]

	    this.bot.postRawMessage(
	      data.channel,
	      {
	      	"icon_emoji": ":cat:",
	      	"username": "JiraCat",
	        "attachments": [
	            {
	                "color": "#6338aa",
	                "title": issue.key + ": " + issue.fields.summary,
	                "fields": fields,
	                "footer": "jira... amirite?",                
	            }
	        ]
	      }
	    );
	}

	async logIssueName(issueNumber) {
		try {
			return await jira.findIssue(issueNumber);
		} catch (err) {
			throw(err);
		}
	}

	help() {
		return 'Usage: `?jira <ticket-number>`.';
	}
};
