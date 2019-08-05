"use strict";
const GoogleSpreadsheet = require("google-spreadsheet");
const GoogleSheetsUtil = require('./spread-sheet-util');
const sheets = config.getKey('google_sheets');
if (sheets && sheets.sheet_id) {
  const doc = new GoogleSpreadsheet(sheets.sheet_id);
}

const DOC_URL = `https://docs.google.com/spreadsheets/d/${sheets.sheet_id}`
const HELP_MSG = `
Sorry couldn't find a sheet for this channel. Please visit: ${DOC_URL}
and add a tab with the name being this channels id.
`

module.exports = class GoogleSheets extends BaseModule {
  constructor(bot) {
    super(bot)
    this.googleSheetsUtil = new GoogleSheetsUtil()
  }

  async handle(data) {
    const sheet = await this.googleSheetsUtil.getSheetForChannel(data.channel);
    if (!sheet) {
      this.bot.postMessageToThread(data.channel, HELP_MSG, data.ts);
      return;
    }

    const fields = await this.createFields(sheet);
    this.postFields(data.channel, fields);
  }


  async createFields(sheet) {
    const rows = await this.googleSheetsUtil.getRows(sheet);
    return rows.map(it => {
      return {
        title: it.title,
        value: it.body
      }
    });
  }

  postFields(channel, fields) {
    this.bot.postRawMessage(channel, {
      icon_emoji: ":book:",
      username: "SheetsCat",
      attachments: [
        {
          color: "#188038",
          footer: `Google sheets bot. Add new or update existing data by visiting: ${DOC_URL}`,
          fields: fields,
        }
      ]
    });
  }

  help() {
    return "Google Sheets";
  }

  getType() {
    return [BaseModule.TYPES.MODULE];
  }
};
