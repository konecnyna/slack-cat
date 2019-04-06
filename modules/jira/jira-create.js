'use strict'

module.exports = class JiraCreate {
  constructor (context) {
    this.context = context
  }

  async createJiraTicket (body, jira) {
    const userData = await this.context.bot.userDataPromise(body.user.id)
    const currentUserRealName = userData.user.profile.real_name
    const currentUserEmail = userData.user.profile.email
    const shouldAssign = body.submission.assign_select == 'true'
    try {
      const payload = {
        fields: {
          project: {
            key: body.submission.project
          },
          summary: body.submission.title,
          description: `${
            body.submission.description
          }\n\n\nh2. Reporter:\n\n*${currentUserRealName} - (${currentUserEmail})*`,
          issuetype: {
            name: 'Bug'
          }
        }
      }

      if (shouldAssign) {
        const user = await this.findUser(jira, currentUserEmail)
        if (user && user.length) {
          payload['fields']['assignee'] = { name: user[0].name }
        }
      }

      return await jira.addNewIssue(payload)
    } catch (e) {
      console.log(e)
    }
  }

  async findUser (jira, email) {
    return await jira.searchUsers({ username: email })
  }

  createRoutes (app, callbackId, projects) {
    app.post('/jira-create', (req, res) => {
      // extract the verification token, slash command text,
      // and trigger ID from payload
      const { token, text, trigger_id } = req.body

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
              hint: 'Title of the problem'
            },
            {
              label: 'Project',
              type: 'select',
              name: 'project',
              options: projects.map(({ key }) => ({
                label: key,
                value: key
              }))
            },
            {
              label: 'Assign to me',
              type: 'select',
              name: 'assign_select',
              value: 'true',
              options: [
                {
                  label: 'true',
                  value: 'true'
                },
                {
                  label: 'false',
                  value: 'false'
                }
              ]
            },
            {
              label: 'Description',
              type: 'textarea',
              name: 'description',
              optional: true,
              hint: '30 second summary of the problem'
            }
          ]
        },
        req.body,
        res
      )
    })
  }
}
