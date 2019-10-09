'use strict';

const EmojiFont = require('./emojifont.js');
const GoogleSpreadsheet = require("google-spreadsheet");
const GoogleSheetsUtil = require('../google-sheets/spread-sheet-util');
const sheets = config.getKey('google_sheets');
const DOC_URL = `https://docs.google.com/spreadsheets/d/${sheets ? sheets.sheet_id : "" || ""}`
const HELP_MSG = `
Sorry couldn't find a sheet for this channel. Please visit: ${DOC_URL}
and add a tab with the name being this channels id.
`
const SHEET_ID = "1PXPOWgYbONZv5PRc3yT8rZ2AG6iA2qy5cKtdWp2wbaE";

module.exports = class EmojifontModule extends BaseModule {

  constructor(bot) {
    super(bot);
    this.emojiFont = new EmojiFont();
    this.googleSheetsUtil = new GoogleSheetsUtil();
    if (sheets && sheets.sheet_id) {
      this.doc = new GoogleSpreadsheet(sheets.sheet_id);
    }
  }

  async handle(data) {
    console.log("handling!");

    if (!this.doc) {
      console.log("heck");
      this.bot.postMessage(data.channel, HELP_MSG);
      return;
    }

    console.log("have a doc ");

    const sheet = await this.googleSheetsUtil.getSheetForChannel(this.doc, SHEET_ID);
    console.log("got the sheet" + sheet);
    if (!sheet) {
      this.bot.postMessageToThread(data.channel, HELP_MSG, data.ts);
      return;
    }

    const rows = this.googleSheetsUtil.getRows(sheet);
    console.log("rows " + rows);

    const cells = this.googleSheetsUtil.getCells(sheet);
    console.log("cells " + cells);

    console.log("kick off");
    if (data.args.map(x => x.toLowerCase()).includes("--theworks")) {
      this.bot.postMessage(data.channel, this.emojiFont.giveEmTheWorks());
    } else {
      console.log("lets go");
      this.bot.postMessageToThread(data.channel, this.emojiFont.emojify(data.user_text), data.ts);
      console.log("over");
    }
  }

  help() {
    return 'Usage: `?emojifont my phrase` to translate your phrase to emoji. Use ?emojifont --theworks for the works. Also aliased to ?emojify'
  }

  aliases() {
    return ['emojify']
  }

  getType() {
      return [BaseModule.TYPES.MODULE];
  }
}
