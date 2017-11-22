'use strict';

const util = require('util');
const userPattern = new RegExp(/\<@(.*.)\>/, 'i');

module.exports = class Plus extends BaseStorageModule {
  handle(data) {
    if (!data.user_text) {
      return
    }

    
    const matches = data.user_text.match(userPattern);    
    if (matches && data.user === matches[1] || data.user === data.user_text) {
      // Person is being an ahole and trying to plus themselves!
      this.bot.postMessage(data.channel, "You'll go blind like that kid!");
      return;
    }

    if (!matches || matches.length < 2) {
      // No user was refs so plus the raw text.]
      this.plusUser(
          data.channel, 
          data.user_text.toLowerCase()
        );
      return;
    }
    

    // Resolve slack handle.
    this.bot
      .getUserNameFromId(matches[1])
      .then(userData => {
        this.plusUser(data.channel, 
          userData.user.display_name ? userData.user.display_name : userData.user.name
        );
      })
      .catch(err => {
        console.error(err);
        this.postErrorMessage(data);
      });
  }

  help() {
    return 'Show people love by plusing them!';
  }

  registerSqliteModel() {
    this.PlusModel = this.db.define('pluses', {
      name: this.Sequelize.STRING,
      pluses: this.Sequelize.INTEGER,
    });
  }

  aliases() {
    return ['++', '+'];
  }

  postErrorMessage(data) {
    this.bot.postMessage(data.channel, 'Something went wrong...');
  }

  async plusUser(channel, userName) {
    const pluses = await this.upsert(
      this.PlusModel,
      { where: { name: userName } },
      {
        name: userName,
        pluses: 1,
      },
      {
        pluses: this.db.literal('pluses + 1'),
      }
    );

    const msg = util.format(
      '%s now has %d pluses!',
      userName,
      pluses.get('pluses')
    );
    this.bot.postMessage(channel, msg);
  }
};
