'use strict';

const Chooser = require('../choose/Chooser');
const chooser = new Chooser();
const Op = require('sequelize').Op;

module.exports = class Pair {
  async pairMembers(members, mixerCatModel) {
    const matches = [];
    const userMap = {};
    for (let i = 0; i < members.length; i++) {
      const user = members[i];
      if (userMap[user]) {
        continue;
      }
      userMap[user] = true;
      const pairedUsers = await this.getPair(user, members, mixerCatModel);
      if (pairedUsers.length) {
        userMap[pairedUsers[1]] = true;
        matches.push(pairedUsers);
      }
    }

    return matches;
  }
  
  async getPair(userId, users, pairedTable) {
    const potentialPairs = await this.getValidPairs(userId, users, pairedTable);
    if (!potentialPairs.length) {
      // User is out of matches.
      return [];
    }

    const pairedMember = chooser.getRandomUser(potentialPairs);
    const result = await this.savePair(userId, pairedMember, pairedTable);

    return [userId, pairedMember];
  }

  async getValidPairs(userId, users, pairedTable) {
    const previousPairs = await pairedTable
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
      return !previousPairs.includes(it) && it !== userId;
    });
  }

  async savePair(user, pairedUser, pairedTable) {
    try {
      await pairedTable.create({
        memberOne: user,
        memberTwo: pairedUser,
      });
    } catch (e) {
      console.error(e);
    }
  }
};
