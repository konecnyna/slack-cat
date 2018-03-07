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

const testReaction = {
  type: 'reaction_added',
  user: 'U7YMR8S3H',
  item: {
    type: 'message',
    channel: 'C7XPH1X8V',
    ts: '1519401099.000639',
  },
  reaction: '',
  item_user: 'U94UFE802',
  event_ts: '1519405945.000295',
  ts: '1519405945.000295',
};

describe('Reaction Test', () => {
  beforeEach(() => {
    global.config = new Config();
    global.STORAGE_PATH = './storage/db-dev.sqlite';
    global.BaseModule = require('../core/base-module.js');
    global.BaseStorageModule = require('../core/storage-base-module.js');
    router = new Router(new MockBot());
  });

  // it('Test eggplant command', done => {
  //   router.bot.setCallback(data => {
  //     console.
  //     data.should.equal('( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)');
  //     done();
  //   });

  //   testReaction.reaction = 'eggplant';
  //   router.handleReaction(testReaction);
  // });

  //TODO: This has a memory leak. Will fix.
  // it('Test heavy_plus_sign command', done => {

  //   router.bot.setCallback(data => {
  //     data.should.equal('testuser now has 1 pluses!');
  //     done();
  //   });

  //   testReaction.reaction = 'heavy_plus_sign';
  //   router.handle(testReaction);
  // });
});
