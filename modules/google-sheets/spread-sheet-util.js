module.exports = class SpreadSheetUtil {
  constructor(doc) {
    this.doc = doc;
  }

  async init() {
    await this.authDoc()
    await this.doc.loadInfo();
  }

  async authDoc() {
    const { client_email, private_key } = config.getKey("google_sheets")
    return await this.doc.useServiceAccountAuth({
      client_email: client_email,
      private_key: private_key
    });
  }


  async getDoc() {
    await this.doc.loadInfo();
    return this.doc._rawSheets;
  }

  async getCells(sheet) {
    return await sheet.loadCells();
  }

  async getRows(sheet) {
    return await sheet.getRows();
  }

  async addRow(sheet, row) {
    return await sheet.addRow(row);
  }

  async addSheet(title, row, col) {
    return await this.doc.addWorksheet({
      'title': title,
      'rowCount': row,
      'colCount': col
    });
  }

  async getSheetRows(key) {
    await this.authDoc();
    const sheets = await this.getDoc();
    const rows = await this.getRows(sheets[key]);
    return rows;
  }

  async getSheetForChannel(channel) {
    await this.authDoc();
    const sheets = await this.getDoc();
    const id = Object.keys(sheets).find(it => {
      const { title } = this.doc.sheetsById[it]
      return title === channel;
    })

    return this.doc.sheetsById[id];
  }
}