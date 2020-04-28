'use strict';

const EmojiFont = require('./emojifont.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const GoogleSheetsUtil = require('../google-sheets/spread-sheet-util');
const HELP_MSG = "Sorry couldn't find the EmojiFont sheet.";
const sheetParams = config.getKey("emojifont");
const DOC_URL = `https://docs.google.com/spreadsheets/d/${sheetParams ? sheetParams.sheet_id : "" || ""}`

module.exports = class EmojifontModule extends BaseModule {

  constructor(bot) {
    super(bot);
    if (sheetParams && sheetParams.sheet_id) {
      const doc = new GoogleSpreadsheet(sheetParams.sheet_id);
      this.doc = doc;
      this.googleSheetsUtil = new GoogleSheetsUtil(doc);
    }
  }

  async handle(data) {
    if (!this.doc) {
      this.bot.postMessage(data.channel, HELP_MSG);
      return;
    }

    const sheet = await this.googleSheetsUtil.getSheetForChannel(sheetParams.sheet_name);

    if (!sheet) {
      this.bot.postMessageToThread(data.channel, HELP_MSG, data.ts);
      return;
    }

    //const rows = await this.googleSheetsUtil.getRows(sheet);
    const { lastColumnLetter, rowCount } = sheet;
    const rows = await sheet.getRows();
    //[`A1:${lastColumnLetter}${rowCount}`]
    await sheet.loadCells()

    const cleanedCells = [];
    rows.forEach(row => {
      const rowNumber = row.rowNumber;
      // TODO: make dynamic
      [...Array(24).keys()].map(i => {
        let value = sheet.getCell(rowNumber, i).value
        if (value) {
          cleanedCells.push({
            x: i,
            y: rowNumber,
            value: value.toString()
          });
        }
      })
    });

    const emojiFont = new EmojiFont(cleanedCells);
    if (data.args.map(x => x.toLowerCase()).includes("--theworks")) {
      this.bot.postMessage(data.channel, emojiFont.giveEmTheWorks());
    } else {
      try {
        const resp = emojiFont.emojify(data.user_text);
        this.bot.postMessage(data.channel, resp);
      }
      catch (error) {
        console.error(`EmojiFont error: ${error}`);
        this.bot.postMessageToThread(data.channel, `Something went wrong with EmojiFont: (${error}).`, data.ts);
      }
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
