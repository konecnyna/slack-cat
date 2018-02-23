// Import chai.
const chai = require('chai');
const path = require('path');
const expect = chai.expect;
// Tell chai that we'll be using the "should" style assertions.
chai.should();

// Import the Rectangle class.
const Router = require(path.join(__dirname + '/../core', 'router.js'));
const MockBot = require(path.join(__dirname + '/../core', 'mock-bot.js'));
const Config = require(path.join(__dirname + '/../core', 'mock-config.js'));


// Remove old dev db for tests.
const fs = require('fs');
const filePath = path.join(__dirname + '/../storage', 'db-dev.sqlite'); 
if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
}

describe('Modules Test', () => {
  beforeEach(() => {
    global.config = new Config();
    global.STORAGE_PATH = "./storage/db-dev.sqlite";
    global.BaseModule = require('../core/base-module.js');
    global.BaseStorageModule = require('../core/storage-base-module.js');    
    router = new Router(new MockBot());
  });

  it('Test ping command', done => {
    const pingCmdData = {
      type: 'message',
      channel: 'D7U2P6CE4',
      user: 'U5WTZH6LA',
      text: '?ping',
      ts: '1510162026.000465',
      source_team: 'T5XMSKCAJ',
      team: 'T5XMSKCAJ',
    };

    router.bot.setCallback(data => {
      data.should.equal('pong');
      done();
    });

    router.handle(pingCmdData);
  });

  it('Test Summon command', done => {
    const summonCmdData = {
      type: 'message',
      channel: 'D7U2P6CE4',
      user: 'U5WTZH6LA',
      text: '?summon test',
      ts: '1510162026.000465',
      source_team: 'T5XMSKCAJ',
      team: 'T5XMSKCAJ',
    };

    router.bot.setCallback(data => {
      const isValidImageUrl = /\.(gif|jpg|jpeg|png)$/i.test(data);
      isValidImageUrl.should.equal(true);
      done();
    });

    router.handle(summonCmdData);
  });

  it('Test Gif command', done => {
    const summonCmdData = {
      type: 'message',
      channel: 'D7U2P6CE4',
      user: 'U5WTZH6LA',
      text: '?gif test',
      ts: '1510162026.000465',
      source_team: 'T5XMSKCAJ',
      team: 'T5XMSKCAJ',
    };

    router.bot.setCallback(data => {
      const isValidImageUrl = /\.(gif|jpg|jpeg|png)$/i.test(data);
      isValidImageUrl.should.equal(true);
      done();
    });

    router.handle(summonCmdData);
  });

  it('Test Learn command', done => {
    const learnCmdData = {
      type: 'message',
      channel: 'D7U2P6CE4',
      user: 'U5WTZH6LA',
      text: '?learn test | this is a test',
      ts: '1510162026.000465',
      source_team: 'T5XMSKCAJ',
      team: 'T5XMSKCAJ',
    };

    router.bot.setCallback(data => {
      data.should.equal("Learned test");
      done();
    });

    router.handle(learnCmdData);
  });

  it('Test Learn command with mention', done => {
    const learnCmdData = {
      type: 'message',
      channel: 'D7U2P6CE4',
      user: 'U5WTZH6LA',
      text: '?learn <@U7XLS9820> | test1234',
      ts: '1510162026.000465',
      source_team: 'T5XMSKCAJ',
      team: 'T5XMSKCAJ',
    };

    router.bot.setCallback(data => {      
      data.should.equal("Learned testuser");
      done();
    });


    router.handle(learnCmdData);
  });

  it('Test Learn command storage', done => {
    const learnCmdData = {
      type: 'message',
      channel: 'D7U2P6CE4',
      user: 'U5WTZH6LA',
      text: '?learns test',
      ts: '1510162026.000465',
      source_team: 'T5XMSKCAJ',
      team: 'T5XMSKCAJ',
    };

    router.bot.setCallback(data => {
      data.includes("this is a test").should.equal(true);
      done();
    });

    router.handle(learnCmdData);
  });

  it('Test Learn negative lookback', done => {
    const learnCmdData = {
      type: 'message',
      channel: 'D7U2P6CE4',
      user: 'U5WTZH6LA',
      text: '?test -1',
      ts: '1510162026.000465',
      source_team: 'T5XMSKCAJ',
      team: 'T5XMSKCAJ',
    };

    router.bot.setCallback(data => {
      data.includes("this is a test").should.equal(true);
      done();
    });

    router.handle(learnCmdData);
  });
});
