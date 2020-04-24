
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
    const { incident_description, service_id } = body.submission;
    const { user } = await this.bot.userDataPromise(body.user.id);
    const email = user.profile.email
    const result = await this.util.createIncident(service_id, email, incident_description)
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
    const teams = (await this.util.listTeams()).filter(it => {
      return it.name.toLowerCase().includes("test")
    })

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
            name: 'service_id',
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