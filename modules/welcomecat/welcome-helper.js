'use strict';

module.exports = class WeclomeHelper {
  constructor(model) {
    this.model = model;
  }

  async setMessage(context, data, channel) {
    const message = await context.upsert(
      this.model,
      { where: { channel: channel } },
      {
        channel: channel,
        message: data.user_text,
      },
      {
        message: data.user_text,
      }
    );    
    return await message.get('message');
  }

  async updateModel(channel, fieldName, value) {
    const fields = {};
    fields[fieldName] = value;

    this.model.update(fields, {
      where: { channel: channel }
    });
  }

  async getOptionsForChannel(channel) {
    const welcomeObject = await this.model.findOne({
      where: {
        channel: channel
      },
    });

  
    return welcomeObject;
  }
}