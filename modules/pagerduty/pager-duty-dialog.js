
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
    await this.util.createIncident()
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    // const userData = await this.bot.userDataPromise(body.user.id);
    // const fields = this.createFields(body);
    // this.postStandupToChannel(
    //   body.channel.id,
    //   fields,
    //   userData.user.profile.real_name,
    //   userData.user.profile.image_48
    // );
  }

  async pageRoutes(request, response) {
    await this.util.createIncident()

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
            label: 'Choose team to page',
            type: 'select',
            name: 'type',
            value: 'Story',
            options: options
          }
        ]
      },
      request.body,
      response
    );
  }
}