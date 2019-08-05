module.exports = class SpreadSheetUtil {

  async authDoc(doc) {
    return new Promise((resolve, reject) => {
      const { private_key, client_email } = config.getKey("google_sheets")
      doc.useServiceAccountAuth({ private_key, client_email }, () => {
        resolve();
      });
    });
  }

  async getDoc(doc) {
    return new Promise((resolve, reject) => {
      try {
        doc.getInfo((err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          }          
          resolve(info.worksheets);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async getCells(sheet) {
    return new Promise((resolve, reject) => {
      sheet.getCells({}, function (err, rows) {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      });
    });
  }

  async getRows(sheet) {
    return new Promise((resolve, reject) => {
      sheet.getRows({}, function (err, rows) {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      });
    });
  }

  async getSheetForChannel(doc, channel) {
    await this.authDoc(doc);
    const sheets = await this.getDoc(doc);
    return sheets.find(it => {
      return it.title === channel
    });
  }
}