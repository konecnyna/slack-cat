const request = require('request-promise');
const token = config.getKey('slack_access_token_oauth');
const NEW_EMOJI_QUERY = `
SELECT *
FROM emoji_feeds
WHERE emoji_feeds.date_added BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()
ORDER BY emoji_feeds.date_added  DESC`;

class EmojiFeedUtil {
  async newEmojis(db, table) {
    const rez = await db.query(NEW_EMOJI_QUERY.trim());
    return rez[0].map(it => {
      return it.key
    });
  }

  async checkNewEmojis() {
    const { emoji } = await request(`https://slack.com/api/emoji.list?token=${token}`, {
      json: true
    });

    const emojiList = [];

    const promises = Object.keys(emoji).map(async key => {
      const result = await this.EmojiFeed.findOne({
        where: {
          key: key,
        },
      });

      if (!result) {
        emojiList.push(key)
        return this.EmojiFeed.create({
          key: key,
          value: emoji[key],
          date_added: new Date()
        })
      }
    })

    await Promise.all(promises)
    return emojiList;
  }
}


module.exports.emojiFeedUtil = new EmojiFeedUtil();