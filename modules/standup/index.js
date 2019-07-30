"use strict";

const DIALOG_ID = "standup-dialog";

module.exports = class Standup extends BaseModule {
  constructor(bot) {
    super(bot);
  }

  // https://api.slack.com/apps/AA3487W5T/slash-commands?
  createRoutes(app) {
    app.post("/standup", (request, response) => {
      const { token, text, trigger_id } = request.body;

      this.showDialog(
        {
          title: "Standup Notes",
          callback_id: DIALOG_ID,
          submit_label: "Submit",
          elements: [
            {
              label: "Yesterday I did:",
              type: "textarea",
              name: "yesterday",
              value: "- ",
              optional: false
            },
            {
              label: "Today I'm doing:",
              type: "textarea",
              value: "- ",
              name: "today",
              optional: false
            },
            {
              label: "Any blockers?",
              type: "textarea",
              name: "blockers",
              optional: true
            }
          ]
        },
        request.body,
        response
      );
    });
  }

  async onDialogSubmit(body) {
    const userData = await this.bot.userDataPromise(body.user.id);
    const fields = this.createFields(body);
    this.postStandupToChannel(
      body.channel.id,
      fields,
      userData.user.profile.real_name,
      userData.user.profile.image_48
    );
  }

  postStandupToChannel(channel, fields, realName, avatar) {
    this.bot.postRawMessage(channel, {
      icon_url: avatar,
      username: `Standup notes for ${realName}`,      
      attachments: [
        {
          color: "#A2A2A2",
          fields: fields,
          footer: 'Invoked using /standup'
        }
      ]
    });
  }

  createFields(body) {
    const { blockers, yesterday, today } = body.submission;
    const fields = [];

    fields.push(this.createField("Yesterday I did:", yesterday));
    fields.push(this.createField("Today I'm doing:", today));

    if (blockers) {
      fields.push(this.createField("Blockers:", blockers));
    }

    return fields;
  }

  createField(title, value) {
    return {
      title: title,
      value: value,
      short: false
    };
  }

  dialogCallbackId() {
    return DIALOG_ID;
  }

  help() {
    return "/standup";
  }

  getType() {
    return [BaseModule.TYPES.DIALOG];
  }
};
