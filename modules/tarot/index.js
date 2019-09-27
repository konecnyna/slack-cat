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
    this.bot.postMessage(data.channel, responsePrefix() + this.tarotCards.describe(data.user_text));
  }

  help() {
    return 'Usage: `?tarot` for a single random card. You may also ask me for a specific spread, or to tell you more about a certain card, suit, or rank.'
  }

  aliases() {
    return [':flower_playing_cards:', ' :flower_playing_cards:']
  }

  getType() {
      return [BaseModule.TYPES.MODULE];
  }
}
