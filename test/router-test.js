// Import chai.
const chai = require('chai');
const path = require('path');
const expect = chai.expect;
// Tell chai that we'll be using the "should" style assertions.
chai.should();

// https://github.com/sindresorhus/pageres/issues/178#issuecomment-127375281
require('events').EventEmitter.defaultMaxListeners = Infinity;

// Import the Rectangle class.
const Router = require(path.join(__dirname + '/../core', 'router.js'));
const MockBot = require(path.join(__dirname + '/../core', 'mock-bot.js'));
const Config = require(path.join(__dirname + '/../core', 'mock-config.js'));

describe('Router Test', () => {
  beforeEach(() => {
    global.config = new Config();
    global.BaseModule = require('../core/base-module.js');
    global.BaseStorageModule = require('../core/storage-base-module.js');
    router = new Router(new MockBot());
  });

  it("Router shouldn't be null", () => {
    // Assert that an error will be thrown if
    // the width it set to a non-numerical value.
    if (!router) {
      router.should.throw(Error);
    }
  });

  it('Router should load at least 10 commands', () => {
    const modules = Object.keys(router.modules).length;

    expect(modules, 'Loaded less then 10 commands').to.be.gt(10);
  });



  it('Router blacklist test', () => {
    const keys = Object.keys(router.modules);
    
    expect(keys.indexOf("poop") > -1, "Poop Module doesnt exsist").to.equal(true);

    // Set blacklist.
    config.blacklist = ["poop"];
    router = new Router(new MockBot());    
    const keysWithBlackList = Object.keys(router.modules);
    expect(keysWithBlackList.indexOf("poop") > -1, "Poop Module doesnt exsist").to.equal(false);    


    // Cleanup.
    config.blacklist = [];
    router = new Router(new MockBot());
  });


  it('Test ping command', () => {
    const pingCmdData = {
      type: 'message',
      channel: 'D7U2P6CE4',
      user: 'U5WTZH6LA',
      text: '?ping',
      ts: '1510162026.000465',
      source_team: 'T5XMSKCAJ',
      team: 'T5XMSKCAJ',
    };

    router.handle(pingCmdData);

    router.bot.msg.should.equal('pong');
  });

  it('Test that cmd args are parsed', () => {
    const dataWithArg = {
      type: 'message',
      channel: 'D7U2P6CE4',
      user: 'U5WTZH6LA',
      text: '?ping --args test',
      ts: '1510086602.000191',
      source_team: 'T5XMSKCAJ',
      team: 'T5XMSKCAJ',
    };

    const dataBadCmd = {
      type: 'message',
      channel: 'D7U2P6CE4',
      user: 'U5WTZH6LA',
      text: 'hi hello im -nick',
      ts: '1510086602.000191',
      source_team: 'T5XMSKCAJ',
      team: 'T5XMSKCAJ',
    };

    const matches = router.addExtras(dataWithArg);
    matches[0].should.equal("?ping");
    matches[1].should.equal("ping");
    dataWithArg['cmd'].should.equal('ping');
    dataWithArg['user_text'].should.equal('test');
    dataWithArg['args'].length.should.equal(1);
    dataWithArg['args'][0].should.equal('--args');

    const badMatches = router.addExtras(dataBadCmd);
    badMatches.should.equal(false);
  });
});
