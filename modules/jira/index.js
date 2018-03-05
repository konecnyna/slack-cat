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

module.exports = class Jira extends BaseModule {
	async handle(data) {
		// Initialize
		if (!jiraSecrets) {
			this.bot.postMessage(
				data.channel,
				"Please add ```'jira_api': {\n\
    		'host': 'stashinvest.atlassian.net',\n\
    		'username': 'user@kewldomain.com',\n\
    		'password': 'xxxxxxxxxxx'\n\
    		}``` to `config.dat`"
			);
			return;
		}


		if (!data.user_text) {
			this.displayHelp(data);
			return;
		}


		if (data.cmd === 'jira-create') {
			const newIssue = await this.createJiraTicket(data);
			this.postIssue(data, newIssue);
			return;
		}



		if (data.cmd === 'jira-tix') {
			const jql = `assignee = ${data.user_text} AND status in ('In Progress')`;
			const searchResults = await jira.searchJira(jql, {maxResults: 10})
			this.postUserTix(data, searchResults);
			return;
		}

		try {
			const issue = await this.logIssueName(data.user_text);
			this.sendJiraStatus(data, issue);
		} catch (e) {
			console.log(e);
			this.bot.postMessage(data.channel, "Couldn't find anything matching: " + data.user_text);
		}	
	}

	displayHelp(data) {
		this.bot.postMessage(data.channel, this.help());
	}

	async createJiraTicket(data) {
		const matches = data.user_text.match(QUOTES_REGEX);
		if (matches.length !== 2) {
			this.displayHelp(data);
			return;
		}

		try {		
			return await jira.addNewIssue(
				{
				    "fields": {
				       "project":
				       { 
				          "key": "STSH"
				       },
				       "summary": matches[0].replace(new RegExp('"', 'g'), ''),
				       "description": matches[1].replace(new RegExp('"', 'g'), ''),
				       "issuetype": {
				          "name": "Bug"
				       }
				   }
				}
			);	
		} catch (e) {
			console.log(e);
		}
	}

	postUserTix(data, searchResults) {
		const tix = searchResults.issues.map(issue => {
			return `${issue.key} - https://${jiraSecrets.host}/browse/${issue.key}`;
		});
	  	this.bot.postRawMessage(
	      data.channel,
	      {
	      	"icon_emoji": ":cat:",
	      	"username": "JiraCat",
	        "attachments": [
	            {
	                "color": "#6338aa",
	                "fields":[{
			            "title": `In progress tickets for ${data.user_text}`,
			            "value": tix.join("\n"),
			            "short": true
			        }],		                
	                "footer": "jira... amirite?",                
	            }
	        ]
	      }
	    );
	}

	postIssue(data, issue) {
	  this.bot.postRawMessage(
	      data.channel,
	      {
	      	"icon_emoji": ":cat:",
	      	"username": "JiraCat",
	        "attachments": [
	            {
	                "color": "#6338aa",
	                "title": `Created: ${issue.key}`,
	                "title_link": `https://${jiraSecrets.host}/browse/${issue.key}`,	                
	                "footer": "jira... amirite?",                
	            }
	        ]
	      }
	    );
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
		return 'Usage:\n`?jira <ticket-number>`.\n`?jira-create "<title>" "<description>"`';
	}

	aliases() {
		return ['jira-create', 'jira-tix'];
	}
};
