'use strict';

const Chooser = require('../choose/Chooser');
const chooser = new Chooser();
const Op = require('sequelize').Op;

module.exports = class Pair {
  async pairMembers(members, mixerCatModel) {    
    const matches = [];
    this.matchedUsers = {};
    this.mixerCatModel = mixerCatModel;

    for (let i = 0; i < members.length; i++) {      
      if (members.length < 2) {
        // Not enough ppl to pair;
        break;
      }

      const user = members[i];
      if (this.matchedUsers[user]) {        
        continue;
      }

      const pairedUsers = await this.getPair(user, members);
      if (pairedUsers.length) {
        matches.push(pairedUsers);
        this.matchedUsers[pairedUsers[0]] = true;
        this.matchedUsers[pairedUsers[1]] = true;
      }
    }

    return matches;
  }

  async getPair(userId, users) {
    const potentialPairs = await this.getValidPairs(userId, users);
    if (!potentialPairs.length) {
      // User is out of matches.      
      return [];
    }

    const pairedMember = chooser.getRandomUser(potentialPairs);
    const result = await this.savePair(userId, pairedMember);

    return [userId, pairedMember];
  }

  async getValidPairs(userId, users) {
    const previousPairs = await this.mixerCatModel
      .findAll({
        where: {
          [Op.or]: [{ memberOne: userId }, { memberTwo: userId }],
        },
      })
      .map(it => {
        const memberOne = it.get('memberOne');
        const memberTwo = it.get('memberTwo');
        if (memberOne === userId) {
          return memberTwo;
        }

        return memberOne;
      });

    return users.filter(it => {
      return !previousPairs.includes(it) 
        && it !== userId
        && this.matchedUsers[it] !== true;
    });
  }

  async savePair(user, pairedUser) {
    try {
      await this.mixerCatModel.create({
        memberOne: user,
        memberTwo: pairedUser,
      });
    } catch (e) {
      console.error(e);
    }
  }
};
