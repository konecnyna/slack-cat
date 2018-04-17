'use strict';

module.exports = class WeclomeHelper {
  constructor(model, context) {
    this.model = model;
    this.context = context;
  }

  async setMessage(msg, enabled, channel, genericWelcome) {
    const message = await this.context.upsert(
      this.model,
      { where: { channel: channel } },
      {
        channel: channel,
        message: msg,
        enabled: enabled,
        generic_welcome: genericWelcome
      },
      {
        message: msg,
        enabled: enabled,
        generic_welcome: genericWelcome
      }
    );    
    
    return message.get('message');
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