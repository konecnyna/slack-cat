
module.exports = class PagerDialog {
  constructor(bot, pdUtil) {
    this.bot = bot;
    this.util = pdUtil;
    this.DIALOG_ID = "pagerduty-dialog";
  }

  createRoutes(app, showDialog) {
    this.showDialog = showDialog;
    app.post("/page", (req, res) => {
      this.pageRoutes(req, res)
    });
  }

  async onDialogSubmit(body) {
    const { incident_description } = body.submission;
    const userData = await this.bot.userDataPromise(body.user.id);
    const result = await this.util.createIncident()
    if (!result) {
      return this.bot.postMessageToUser(
        userData.user.id,
        'Failed to create incident! ' + incident_description
      )
    }

    this.bot.postMessageToUser(
      userData.user.id,
      'Success!'
    )
  }

  async pageRoutes(request, response) {
    const teams = await this.util.listTeams()
    const options = teams.map(team => {
      const { name, id } = team;
      return {
        label: name,
        value: id
      }
    })
    this.showDialog(
      {
        title: "PagerDuty Trigger",
        callback_id: this.DIALOG_ID,
        submit_label: "Page",
        elements: [
          {
            label: 'Choose team to page:',
            type: 'select',
            name: 'type',
            value: 'Story',
            options: options,
            optional: false
          },
          {
            label: "Incident Description:",
            type: "textarea",
            name: "incident_description",
            optional: false
          }
        ]
      },
      request.body,
      response
    );
  }
}