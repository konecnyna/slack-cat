'use strict';

const EmojiFont = require('./emojifont.js');
const GoogleSpreadsheet = require("google-spreadsheet");
const GoogleSheetsUtil = require('../google-sheets/spread-sheet-util');
const HELP_MSG = "Sorry couldn't find the EmojiFont sheet.";
const sheetParams = config.getKey("emojifont");
const DOC_URL = `https://docs.google.com/spreadsheets/d/${sheetParams ? sheetParams.sheet_id : "" || ""}`

module.exports = class EmojifontModule extends BaseModule {

  constructor(bot) {
    super(bot);
    this.googleSheetsUtil = new GoogleSheetsUtil();
    this.doc = new GoogleSpreadsheet(sheetParams.sheet_id);
  }

  async handle(data) {
    if (!this.doc) {
      this.bot.postMessage(data.channel, HELP_MSG);
      return;
    }

    const sheet = await this.googleSheetsUtil.getSheetForChannel(this.doc, sheetParams.sheet_name);
    if (!sheet) {
      this.bot.postMessageToThread(data.channel, HELP_MSG, data.ts);
      return;
    }

    const cells = await this.googleSheetsUtil.getCells(sheet);
    const cleanedCells = cells.map((cell) => {
      return {
        x: cell.col,
        y: cell.row,
        value: cell.value
      };
    });
    const emojiFont = new EmojiFont(cleanedCells);

    if (data.args.map(x => x.toLowerCase()).includes("--theworks")) {
      this.bot.postMessage(data.channel, emojiFont.giveEmTheWorks());
    } else {
      this.bot.postMessageToThread(data.channel, emojiFont.emojify(data.user_text), data.ts);
    }
  }

  help() {
    return 'Usage: `?ef my phrase` to translate your phrase to emoji. Use ?ef --theworks for the works. Also aliased to ?emojify and ?emojifont. Add more emojis at ' + DOC_URL;
  }

  aliases() {
    return ['emojify', 'ef']
  }

  getType() {
    return [BaseModule.TYPES.MODULE];
  }
}
