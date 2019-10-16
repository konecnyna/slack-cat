function formattedMemberName(member) {
  return `${member.get('name')}, ${member.get('title')}`
}

module.exports = class RoyaltyHelper {
  constructor(context) {
    this.context = context;
  }

  async displayTitleForUser(user) {
    const courtMember = await this.getRoyaltyModel().findOne({
      where: {
        name: user
      }
    });
    if (courtMember === null) {
      return `I know of no one named ${user} yet.`
    }

    return formattedMemberName(courtMember);
  }

  async displayFullCourtBoard(data) {
    const courtMembers = await this.getRoyaltyModel().findAll({});

    const fields = [];
    courtMembers.forEach((member, index) => {
      fields.push({
        title: formattedMemberName(member),
        short: false,
      });
    });

    this.context.bot.postRawMessage(data.channel, {
      icon_emoji: ':royalcat:',
      username: 'RoyaltyCat',
      attachments: [
        {
          color: '#7851a9',
          fields: fields,
        },
      ],
    });
  }

  async anointUser(userName, title) {
    const courtMember = await this.context.upsert(
      this.getRoyaltyModel(),
      { where: { name: userName } },
      {
        name: userName,
        title: title,
      }, {
        name: userName,
        title: title
      }
    );

    return formattedMemberName(courtMember);
  }

  getRoyaltyModel() {
    return database.modelManager.getModel("royalties")
  }
};
