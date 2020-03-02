module.exports = class PlusHelper {
  constructor(context) {
    this.context = context;
  }

  async displayPlusesForUser(slackUserId) {
    const pluses = await this.getPlusModel().findOne({
      where: {
        slackId: slackUserId,
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
    pluses.forEach((plus, index) => {
      fields.push({
        title: `${index + 1}. ${plus.get('slackId')} (${plus.get(
          'pluses'
        )} pluses)`,
        short: false,
      });
    });

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
      `Don't be a meanie ${
      userData.user.display_name
        ? userData.user.display_name
        : userData.user.name
      }`,
      data.ts
    );
  }

  async plusUser(userSlackId) {
    const pluses = await this.context.upsert(
      this.getPlusModel(),
      { where: { slackId: userSlackId } },
      {
        slackId: userSlackId,
        pluses: 1,
      },
      {
        pluses: this.context.db.literal('pluses + 1'),
      }
    );



    return await pluses.get('pluses');
  }

  getPlusModel() {
    return database.modelManager.getModel("pluses_table")
  }
};
