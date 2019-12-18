const cache = require('memory-cache');

module.exports.handleEggplantReaction = () => {
  return '( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)'
}

module.exports.handlePlus = async (data) => {
  if (cache.get(this.getReactionKey(data)) != null) {
    // try to dup pluses
    return;
  }

  const userName = await this.bot.getUserNameFromId(data.item_user);
  const user = userName.user.profile.display_name || userName.user.name;
  if (data.user === data.item_user) {
    this.bot.postMessageToThread(data.item.channel, `Stop tryna hack ${user}`, data.item.ts);
    return;
  }

  const pluses = await this.plusHelper.plusUser(user);
  cache.put(this.getReactionKey(data), '', 5 * 60 * 1000, () => { });

  const msg = `${user} now has ${pluses} pluses!`;
  this.bot.postMessageToThread(data.item.channel, msg, data.item.ts);
}

const getReactionKey = (data) => {
  return `${data.item_user}
    ${data.item.ts}
    ${data.user}
    ${data.item.channel}
    ${data.item.reaction}`;
}

