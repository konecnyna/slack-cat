'use strict';

const Chooser = require('../choose/Chooser');
const chooser = new Chooser();

module.exports = class Pair {
  async pairMembers(members, mixerCatModel) {    
    const matches = [];
    const userMap = {};
    for (let i=0; i < members.length; i++) {
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
          user_id: userId,          
        },
      })
      .map(it => {
        return it.get('paired_with');
      });
   
    return users.filter(it => {
      return !previousPairs.includes(it) && it !== userId;
    });
  }

  async savePair(user, pairedUser, pairedTable) {
    console.log("saving...", user, pairedUser)
    try {
      await pairedTable.create({
        user_id: user,
        paired_with: pairedUser,
      });
      await pairedTable.create({
        user_id: pairedUser,
        paired_with: user,
      });
      return true;
    } catch (e) {
      console.log('They have already paired DIS IS BAD!');
      return false;
    }
  }

};
