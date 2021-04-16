
const data = require('./memebers')

module.exports = class PlusHelper {
  constructor(context) {
    this.context = context;
  }

  async displayPlusesForUser(slackUserId) {
    const pluses = await this.getPlusModel().findOne({
      where: {
        slackid: slackUserId,
      },
    });

    return pluses.get('pluses');
  }

  async displayLeaderBoard(data) {
    const pluses = await this.getPlusModel().findAll({
      order: [['pluses', 'DESC']],
      limit: 10,
    });

    const fields = [];
    for (var i = 0; i < pluses.length; i++) {
      const name = await this.getDisplayName(pluses[i].get('slackid'))
      fields.push({
        title: `${i + 1}. ${name} (${pluses[i].get(
          'pluses'
        )} pluses)`,
        short: false,
      });
    }

    this.context.bot.postRawMessage(data.channel, {
      icon_emoji: ':chart_with_upwards_trend:',
      username: 'LeaderBoardCat',
      attachments: [
        {
          color: '#90c564',
          fields: fields,
        },
      ],
    });
  }

  async displayBeingMeanMsg(data) {
    const userData = await this.context.bot.getUserNameFromId(data.user);
    this.context.bot.postMessageToThread(
      data.channel,
      `Don't be a meanie ${userData.user.display_name
        ? userData.user.display_name
        : userData.user.name
      }`,
      data.ts
    );
  }

  async getDisplayName(slackId) {
    const userData = await this.context.bot.getUserNameFromId(slackId);
    return userData.user.display_name
      ? userData.user.display_name
      : userData.user.name
  }

  async plusUser(userSlackId) {
    const pluses = await this.context.upsert(
      this.getPlusModel(),
      { where: { slackid: userSlackId } },
      {
        slackid: userSlackId,
        pluses: 1,
      },
      {
        pluses: this.context.db.literal('pluses + 1'),
      }
    );



    return await pluses.get('pluses');
  }

  async plusEvent(userSlackId) {
    await this.getPlusEventModel().create(
      {
        slackid: userSlackId,
        pluses: 1
      }
    );
  }


  async migrate() {
    const newTable = database.modelManager.getModel("pluses_table")
    const oldTable = database.modelManager.getModel("pluses")
    const { members } = data
    const rows = await oldTable.findAll();
    for (var i = 0; i < members.length; i++) {
      await this.findInRow(rows, newTable, members[i].profile.display_name, members[i].id)
    }
  }

  async findInRow(rows, newTable, name, id) {
    const test = rows.find(it => {
      const dbName = it.get('name');
      return name === dbName;
    })

    if (test) {
      console.log(name, id)
      const plusesAmount = await test.get('pluses')
      const pluses = await this.context.upsert(
        newTable,
        { where: { slackid: id } },
        {
          slackid: id,
          pluses: plusesAmount || 1,
        },
        {
          pluses: plusesAmount,
        }
      );

    }
  }

  getPlusModel() {
    return database.modelManager.getModel("pluses_table")
  }

  getPlusEventModel() {
    return database.modelManager.getModel("plus_events")
  }

};
