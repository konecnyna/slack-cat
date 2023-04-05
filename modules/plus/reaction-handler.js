const cache = require('memory-cache');

const handleEggplantReaction = () => {
  return '( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)'
}

const handlePlus = async (data, userName, plusHelper) => {
  if (cache.get(getReactionKey(data)) != null) {
    // try to dup pluses
    return;
  }

  const user = userName.user.profile.display_name || userName.user.name;
  if (data.user === data.item_user) {
    return `Stop tryna hack ${user}`;
  }

  const pluses = await plusHelper.plusUser(data.item_user);
  cache.put(getReactionKey(data), '', 5 * 60 * 1000, () => { });

  return `${user} now has ${pluses} pluses!`;
}

const getReactionKey = (data) => {
  return `${data.item_user}
    ${data.item.ts}
    ${data.user}
    ${data.item.channel}
    ${data.item.reaction}`;
}


module.exports = {
  handleEggplantReaction,
  handlePlus
}