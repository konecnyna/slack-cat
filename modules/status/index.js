'use strict';
const request = require('request');

const key = config.getKey('stock');

const DATA_HIGH_KEY = '2. high';
const DATA_LOW_KEY = '3. low';
const DATA_CLOSE_KEY = '4. close';


const status = (icon, text) => { return { icon: icon, text: text } };
const meeting = status(":date:", "In a meeting")
const office = status(":office:", "In the office")
const unavailable = status(":x:", "Unavailable")
const vacation = status(":palm_tree:", "On vacation")
const wfh = status(":house_with_garden:", "Work from home")

const statusMap = {
  "meeting": meeting,
  "office": office,
  "unavailable": unavailable,
  "vacation": vacation,
  "wfh": wfh
}

module.exports = class Stock extends BaseModule {
  async handle(data) {
    const status = statusMap[data.user_text];

    if (!status) {
      return this.bot.postMessageToThread(
        data.channel,
        this.help(),
        data.ts
      );
    }

    const { icon, text } = status
    await this.bot.setStatus(data.user, icon, text);
    this.bot.postMessageToThread(
      data.channel,
      `I've updated your status to: \`${status.text}\``,
      data.ts
    );
  }



  help() {
    return 'Update your status!\nExample:\n`?status wfh` or short-hand `?s wfh`\n------------------\nStatuses you can use:\n```' + Object.keys(statusMap).join("\n") + '```';
  }



  aliases() {
    return ['s'];
  }
};
