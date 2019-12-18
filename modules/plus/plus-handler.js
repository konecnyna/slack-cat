const userPattern = new RegExp(/\<@([^\s|\<]+)\>/, 'g');

module.exports.hacker = (data) => {
  if (data.user === data.user_text) {
    return true;
  }

  let group;
  while (group = userPattern.exec(data.user_text)) {
    if (group && data.user === group[1] || data.user_text === group[1]) {
      return true;
    }
  }

  return false;
}