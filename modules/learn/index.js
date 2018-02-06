'use strict';

const LearnList = require('./learn-list.js');

module.exports = class Learn extends BaseStorageModule {
  constructor(bot) {
    super(bot);
    this.LearnType = {
      IMAGE: 'image',
      QUOTE: 'quote',
    };

    this.list = new LearnList(bot, this.LearnsModel);
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
      this.displayLearns(data)      
      return;
    }

    if (data.cmd === 'unlearn') {
      this.unlearn(data);
      return;
    }

    if (data.cmd === 'list') {
      this.list.getLearns(data);
      return;
    }

    this.handleLearn(data);
  }

  aliases() {
    return ['learns', 'unlearn', 'list'];
  }

  async displayLearns(data) {
    const msgs = await this.getLearns(data.user_text, 5, true, false);      
    if (msgs) {
      this.bot.postMessage(data.channel, msgs.join("\n"));  
    }    
  }

  unlearn(data) {    
    const input = this.sanatizeInput(data.user_text);
    this.LearnsModel.destroy({
      where: {
        name: input.name,
        learn: input.text
      }
    });

    this.bot.postMessage(data.channel, "Unlearned " + input.name);
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

  async handleLearn(data) {
    const userData = this.getUserArg(data);

    if (!userData || !userData.text) {
      this.bot.postMessage(data.channel, this.help());
      return;
    }

    
    const name = await this.learnGeneral(data, userData);
    this.bot.postMessage(data.channel, 'Learned ' + name); 
  }

  async learnGeneral(data, userData) {
    const authorData = await this.bot.userDataPromise(data.user);
    const input = this.sanatizeInput(data.user_text);

    let name = input.name;    
    if (userData.matches) {
      const userDetails = await this.bot.userDataPromise(userData.matches[1]);
      name = userDetails.user.name;        
    }
    
    this.insertLearn(data, userData, name, authorData.user.name);
    return name;
  }

  async learnUser(data, userData) {
    const authorData = await this.bot.userDataPromise(data.user);
    const targetData = await this.bot.userDataPromise(userData.matches[1]);
    this.insertLearn(data, userData, targetData.user.name, authorData.user.name);
  }


  async insertLearn(data, userData, name, learnedby) {
   let learnType = this.LearnType.QUOTE;
    if (userData.text.indexOf('http') === 0) {
      learnType = this.LearnType.IMAGE;
    }

    const input = this.sanatizeInput(data.user_text);
    
    const learnData = {
      name: name,
      learn: input.text,
      learn_type: learnType,
      learned_by: learnedby,
    };


    this.LearnsModel.create(learnData);    
  }

  sanatizeInput(user_text) {
    const split = user_text.includes("|") ? user_text.split('|') : user_text.split(' ');
    
    return {
      "name": split[0].trim(),
      "text": split.splice(1, split.length).join(' ').trim()
    }
  }

  help() {
    return "Usage: `?learn <@username|keyword> | <url|img|quote|text|etc>`'";
  }
};
