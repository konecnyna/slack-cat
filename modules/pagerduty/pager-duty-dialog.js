
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
    //const email = user.profile.email
    const email = "nkonecny@stashinvest.com"
    const result = await this.util.createIncident(service_id, email, incident_description)

    if (!result) {
      return this.bot.postMessageToUser(
        user.id,
        'Failed to create incident! '
      )
    }
    const { html_url } = result.incident.service;
    this.bot.postMessageToUser(
      user.id,
      `Team has been notified! Track the status of the incident here: ${html_url}`
    )
  }

  async pageRoutes(request, response) {
    const services = await this.util.listServices()
    const options = services.map(service => {
      const { name, id, teams } = service;
      const teamName = teams[0] ? `${teams[0].name} - ${name}` : name;
      return {
        label: teamName,
        value: id
      }
    }).sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

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