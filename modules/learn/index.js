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
      name: {type: this.Sequelize.STRING, primaryKey: true },
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

  createRoutes(app) {
    this.list.createRoutes(app);
  }
  
  async displayLearns(data) {
    const msgs = await this.getLearns(data.user_text, 5, true, false);      
    if (msgs) {
      this.bot.postMessage(data.channel, msgs.join("\n"));  
    }    
  }

  async unlearn(data) {    
    const input = this.sanatizeInput(data.user_text);    
    if (!input.name.length || !input.text.length) {
      this.bot.postMessage(data.channel, "You forgot to give me keybword o unlearn text. You can also use `?unlearn test --index 1`");
      return;
    }

    if (data.args.includes('--index')) {
      const learnData = await this.LearnsModel.findAll({
        where: {
          name: input.name,
        }
      });

      const index = parseInt(input.text);
      if (!learnData[index - 1]) {
        this.bot.postMessage(data.channel, "Bad index");
        return;
      }
      
      const learnText = learnData[index - 1].get('learn');      
      this.LearnsModel.destroy({
        where: {
          name: input.name,
          learn: learnText
        }
      });
    } else {
      this.LearnsModel.destroy({
        where: {
          name: input.name,
          learn: input.text
        }
      });
    }
    

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

    let name = input.name.replace(' ', '-');    
    if (userData.matches) {
      const userDetails = await this.bot.userDataPromise(userData.matches[1]);      
      name = userDetails.user.name.replace(' ', '-');        
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

  getType() {
    return [BaseModule.TYPES.ENDPOINT, BaseModule.TYPES.MODULE];
  }

  help() {
    return "Usage: `?learn <@username|keyword> | <url|img|quote|text|etc>`'";
  }
};
