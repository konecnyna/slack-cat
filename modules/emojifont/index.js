'use strict';
const EmojiFont = require('./emojifont.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const GoogleSheetsUtil = require('../google-sheets/spread-sheet-util');
const sheetParams = config.getKey("emojifont");
const cache = require('memory-cache');

const DOC_URL = `https://docs.google.com/spreadsheets/d/${sheetParams ? sheetParams.sheet_id : "" || ""}`
const HELP_MSG = "Sorry couldn't find the EmojiFont sheet.";
const CACHE_ROWS_KEY = "EmojifontModuleRows"

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

    let rows = cache.get(CACHE_ROWS_KEY);
    if (CACHE_ROWS_KEY == null || data.args.includes('--update')) {
      rows = await sheet.getRows();
      cache.put(CACHE_ROWS_KEY, rows, 6 * 60 * 1000, () => { });
    }

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
    return 'Usage: `?ef my phrase` to translate your phrase to emoji. Use ?ef --theworks for the works. Also aliased to ?emojify and ?emojifont. The sheet is cached but can be manually updated with --update. Add more emojis at ' + DOC_URL;
  }

  aliases() {
    return ['emojify', 'ef']
  }

  getType() {
    return [BaseModule.TYPES.MODULE];
  }
}
