'use strict';

module.exports = class JiraCreate {
  constructor(context) {
    this.context = context;
  }

  async createJiraTicket(body, jira) {
    try {
      return await jira.addNewIssue({
        fields: {
          project: {
            key: body.submission.project,
          },
          summary: body.submission.title,
          description: body.submission.description,
          issuetype: {
            name: 'Bug',
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  createRoutes(app, callbackId, projects) {
    app.post('/jira-create', (req, res) => {
      // extract the verification token, slash command text,
      // and trigger ID from payload
      const { token, text, trigger_id } = req.body;

      this.context.showDialog(
        {
          title: 'Create Jira Ticket!',
          callback_id: 'submit-jira-ticket',
          submit_label: callbackId,
          elements: [
            {
              label: 'Title',
              type: 'text',
              name: 'title',
              value: text,
              hint: '30 second summary of the problem',
            },
            {
              label: 'Project',
              type: 'select',
              name: 'project',
              options: projects.map(({ key }) => ({
                label: key,
                value: key,
              })),
            },
            {
              label: 'Description',
              type: 'textarea',
              name: 'description',
              optional: true,
            },
          ],
        },
        req.body,
        res
      );
    });
  }
};
