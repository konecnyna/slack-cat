'use strict';

module.exports = class Learn extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    this.LearnType = {
      IMAGE: 'image',
      QUOTE: 'quote',
    };
  }

  registerSqliteModel() {
    this.LearnsModel = this.db.define('learns', {
      name: this.Sequelize.STRING,
      learn: this.Sequelize.STRING,
      learn_type: this.Sequelize.STRING,
      learned_by: this.Sequelize.STRING,
    });
  }

  async handle(data) {
    if (data.cmd === 'learns') {
      const userData = this.getUserArg(data);
      const msgs = await this.getLearns(data.user_text, 5, true, false);      
      if (msgs) {
        this.bot.postMessage(data.channel, msgs.join("\n"));  
      }      
      return;
    }

    this.insertLearn(data);
  }

  aliases() {
    return ['learns'];
  }

  async getLearn(keyword, index) {

  }

  async getLearns(keyword, limit, random, index) {
    const params = {
      where: {
        name: keyword,
      }
    }


    if (limit > 0 && !index) {      
      params['limit'] = limit;
    }

    
    if (random) {      
      params['order'] = this.Sequelize.fn('RANDOM');
    }
    
    const learnData = await this.LearnsModel.findAll(params);
    if (Math.abs(index) > learnData.length) {
      // out of index.
      return [];
    }

    // Get specific learn.
    if (index) {
      if (index < 0) {
        return [learnData[learnData.length + index].get('learn')];
      }

      return [learnData[index].get('learn')];
    }

    const msgs = [];
    learnData.map(row => {
      msgs.push(row.get('learn'));
    });

    return msgs;    
  }

  async insertLearn(data) {
    const userData = this.getUserArg(data);

    if (!userData || !userData.text || data.user_text.indexOf('|') === -1) {
      this.bot.postMessage(data.channel, this.help());
      return;
    }

    if (!userData.matches) {
      this.learnGeneral(data);
      return;
    }

    if (userData.matches) {
      this.learnUser(data, userData);
      return;
    }

    this.bot.postMessage(data.channel, this.help());
  }

  async learnGeneral(data) {
    const split = data.user_text.split('|');
    const authorData = await this.bot.userDataPromise(data.user);
    let learnType = this.LearnType.QUOTE;
    if (data.user_text.indexOf('http') === 0) {
      learnType = this.LearnType.IMAGE;
    }

    const learnData = {
      name: split[0].trim(),
      learn: split.splice(1, split.length).join(' '),
      learn_type: learnType,
      learned_by: authorData.user.name,
    };

    this.LearnsModel.create(learnData);
    this.bot.postMessage(data.channel, 'Learned ' + split[0]);
  }

  async learnUser(data, userData) {
    let learnType = this.LearnType.QUOTE;
    if (userData.text.indexOf('http') === 0) {
      learnType = this.LearnType.IMAGE;
    }

    const authorData = await this.bot.userDataPromise(data.user);
    const targetData = await this.bot.userDataPromise(userData.matches[1]);
    
    const split = data.user_text.split('|');    
    const learnData = {
      name: targetData.user.name,
      learn: split.splice(1, split.length).join(' '),
      learn_type: learnType,
      learned_by: authorData.user.name,
    };

    this.LearnsModel.create(learnData);

    this.bot.postMessage(data.channel, 'Learned ' + targetData.user.name);
  }

  help() {
    return "Usage: `?learn <@username|keyword> | <url|img|quote|text|etc>`'";
  }
};
