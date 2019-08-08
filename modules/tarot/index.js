'use strict';

const TarotCards = require('./cards.js');

function responsePrefix() {
  return ":crystal_ball::flower_playing_cards:: "
}

module.exports = class TarotModule extends BaseModule {

  constructor(bot) {
    super(bot);
    this.tarotCards = new TarotCards();
  }

  async handle(data) {
    if (data.user_text === undefined || data.user_text === "") {
      this.bot.postMessage(data.channel, responsePrefix() + this.tarotCards.random());
      return
    }

    this.bot.postMessage(data.channel, responsePrefix() + this.tarotCards.cardDescription(data.user_text));
  }

  help() {
    return 'Usage: `?tarot` for a single random card, `?tarot <card name>` for a specific card. EX: `?tarot The Magician`, `?tarot fool`'
  }

  aliases() {
    return [':flower_playing_cards:']
  }

  getType() {
      return [BaseModule.TYPES.MODULE];
  }
}
