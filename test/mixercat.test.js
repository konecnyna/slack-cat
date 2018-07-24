// Import chai.
const chai = require('chai');
const path = require('path');
const expect = chai.expect;
// Tell chai that we'll be using the "should" style assertions.
chai.should();

// Import the Rectangle class.
const Pair = require(path.join(__dirname + '/../modules/mixercat', 'Pair.js'));

const pair = new Pair();

// Remove old dev db for tests.
const fs = require('fs');
const filePath = path.join(__dirname, 'db-dev.sqlite');
if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
}

global.STORAGE_PATH = filePath;
console.log(filePath);
const Sequelize = require('sequelize');
const db = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: filePath,
  logging: false,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
global.BaseModule = require('../core/base-module.js');
global.BaseStorageModule = require('../core/base-storage-module.js');

const MixerCatModel = db.define('mixer-meetings', {
  memberOne: { type: Sequelize.STRING, primaryKey: true },
  memberTwo: { type: Sequelize.STRING, primaryKey: true },
});

db.sync();

const testMembers3 = ['adam', 'bob', 'charlie'];
const testMembers4 = ['adam', 'bob', 'charlie', 'dan'];
const testMembers5 = ['adam', 'bob', 'charlie', 'dan', 'eric'];
const testMembers15 = [
  'adam',
  'bob',
  'charlie',
  'dan',
  'eric',
  'frank',
  'george',
  'hank',
  'IDIOT',
  'jack',
  'kelly',
  'laura',
  'michelle',
  'nick',
  'paul',
];

const testMembers60 = [
  'voice',
  'unit',
  'power',
  'town',
  'fine',
  'certain',
  'fly',
  'fall',
  'lead',
  'cry',
  'dark',
  'machine',
  'note',
  'wait',
  'plan',
  'figure',
  'star',
  'box',
  'noun',
  'field',
  'rest',
  'correct',
  'able',
  'pound',
  'done',
  'beauty',
  'drive',
  'stood',
  'contain',
  'front',
  'teach',
  'week',
  'final',
  'gave',
  'green',
  'oh',
  'quick',
  'develop',
  'ocean',
  'warm',
  'free',
  'minute',
  'strong',
  'special',
  'mind',
  'behind',
  'clear',
  'tail',
  'produce',
  'fact',
  'street',
  'inch',
  'multiply',
  'nothing',
  'course',
  'stay',
  'wheel',
  'full',
  'force',
  'blue',
];

Array.prototype.flatten = function() {
  return [].concat.apply([], this);
};

describe('Mixercat Test', () => {
  beforeEach(function() {
    // Drop all entries before test
    MixerCatModel.destroy({ where: {} });
  });

  it('Sanity', () => {
    true.should.equal(true);
  });

  // https://planetcalc.com/3757/
  // 3 users - 3unique pairs.
  it('Test 3 users', async () => {
    const pairs = [];
    (await pair.pairMembers(testMembers3, MixerCatModel)).forEach(it => {
      pairs.push(it);
    });

    while (true) {
      const match = await pair.pairMembers(testMembers3, MixerCatModel);
      if (!match.length) {
        break;
      }

      match.forEach(it => {
        pairs.push(it);
      });
    }

    pairs.length.should.equal(3);
  });

  // Set of 4 - unique pairs 6.
  it('Test 4 matches', async () => {
    const pairs = [];
    (await pair.pairMembers(testMembers4, MixerCatModel)).forEach(it => {
      pairs.push(it);
    });

    while (true) {
      const match = await pair.pairMembers(testMembers4, MixerCatModel);
      if (!match.length) {
        break;
      }

      match.forEach(it => {
        pairs.push(it);
      });
    }

    pairs.length.should.equal(6);
  });

  // Set of 5 - unique pairs 10.
  it('Test 5 matches', async () => {
    const pairs = [];
    (await pair.pairMembers(testMembers5, MixerCatModel)).forEach(it => {
      pairs.push(it);
    });

    while (true) {
      const match = await pair.pairMembers(testMembers5, MixerCatModel);
      if (!match.length) {
        break;
      }

      match.forEach(it => {
        pairs.push(it);
      });
    }

    pairs.length.should.equal(10);
  });

  // Set of 15 - unique pairs 105.
  it('Test 15 matches', async () => {
    const pairs = [];
    (await pair.pairMembers(testMembers15, MixerCatModel)).forEach(it => {
      pairs.push(it);
    });

    while (true) {
      const match = await pair.pairMembers(testMembers15, MixerCatModel);
      if (!match.length) {
        break;
      }

      match.forEach(it => {
        pairs.push(it);
      });
    }

    pairs.length.should.equal(105);
  });

  // Set of 60 - unique pairs 1770.
  // http://www.wolframalpha.com/input/?i=60!%2F(2!(60-2)!)
  it('Test 60 matches', async () => {
    const pairs = [];
    (await pair.pairMembers(testMembers60, MixerCatModel)).forEach(it => {
      pairs.push(it);
    });

    while (true) {
      const match = await pair.pairMembers(testMembers60, MixerCatModel);
      if (!match.length) {
        break;
      }

      match.forEach(it => {
        pairs.push(it);
      });
    }

    pairs.length.should.equal(1770);
  });

  it('Test for unique pairs every round', async () => {
    while (true) {
      const match = await pair.pairMembers(testMembers15, MixerCatModel);
      if (!match.length) {
        break;
      }
      const flattened = match.flatten().sort();
      for (let i = 1; i < flattened.length; i++) {
        const prev = flattened[i - 1];
        const current = flattened[i];
        prev.should.not.equal(current);
      }
    }
  });
});
