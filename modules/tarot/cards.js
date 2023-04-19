'use strict';

const Spreads = require('./cardSpreads.js');
const CardSource = require('./cardDefinitions.js');
const Suits = CardSource.Suits;
const Card = CardSource.Card;
const allCards = CardSource.allCards;
const allSuitDescriptions = CardSource.allRankDescriptions;
const allRankDescriptions = CardSource.allRankDescriptions;

function validateCards() {
  const allCardKeys = Object.keys(allCards);
  if (allCardKeys.length != 78) {
    console.log("Some cards are missing");
  }

  allCardKeys.forEach(function (cardKey) {
    const card = allCards[cardKey];
    if (card.name === undefined) {
      console.log("Card " + cardKey + " is missing a name");
      card.name = "Unknown";
    }

    if (card.number === undefined) {
      console.log("Card " + cardKey + " is missing a number");
      card.number = "Unknown";
    }

    if (card.suit === undefined) {
      console.log("Card " + cardKey + " is missing a suit");
      card.suit = "Unknown";
    } else if (card.suit != Suits.Major &&
      card.suit != Suits.Wands &&
      card.suit != Suits.Swords &&
      card.suit != Suits.Cups &&
      card.suit != Suits.Pentacles) {
      console.log("Card " + cardKey + " has an unhandled suit of " + card.suit);
    }

    if (card.emoji === undefined) {
      console.log("Card " + cardKey + " is missing an emoji");
      card.emoji = "Unknown";
    }

    if (card.meanings === undefined) {
      console.log("Card " + cardKey + " is missing an array of upright meanings");
      card.meanings = ["Unknown"];
    } else if (card.meanings.length === 0) {
      console.log("Card " + cardKey + " has an empty an array of inverted meanings");
    } else if (card.meanings.length === 1 && card.meanings[0] == "UprightMeaningStub") {
      console.log("Card " + cardKey + " has unimplemented meanings");
      card.meanings = [];
    }

    if (card.invertedMeanings === undefined) {
      console.log("Card " + cardKey + " is missing an array of inverted meanings");
      card.invertedMeanings = ["Unknown"];
    } else if (card.invertedMeanings.length === 0) {
      console.log("Card " + cardKey + " has an empty an array of inverted meanings");
    } else if (card.invertedMeanings.length === 1 && card.invertedMeanings[0] == "InvertedMeaningStub") {
      console.log("Card " + cardKey + " has unimplemented inverted meanings");
      card.invertedMeanings = [];
    }
  });
}

/// What emoji to print when describing a suit
function minorArcanaSuitEmoji(suit) {
  if (suit == Suits.Cups) {
    return ":wine_glass:"
  }
  if (suit == Suits.Swords) {
    return ":dagger_knife:"
  }
  if (suit == Suits.Wands) {
    return ":stick:"
  }
  if (suit == Suits.Pentacles) {
    return ":coin:"
  }
  return "?";
}

/// what emoji to print when describing a rank
function minorArcanaRankEmoji(rank) {
  if (rank == "Ace") {
    return ":atrain::ctrain::etrain:"
  }
  if (rank == "2") {
    return ":two:"
  }
  if (rank == "3") {
    return ":three:"
  }
  if (rank == "4") {
    return ":four:"
  }
  if (rank == "5") {
    return ":five:"
  }
  if (rank == "6") {
    return ":six:"
  }
  if (rank == "7") {
    return ":seven:"
  }
  if (rank == "8") {
    return ":eight:"
  }
  if (rank == "9") {
    return ":nine:"
  }
  if (rank == "10") {
    return ":keycap_ten:"
  }
  if (rank == "Page") {
    return ":morty:"
  }
  if (rank == "Knight") {
    return ":horse_racing:"
  }
  if (rank == "Queen") {
    return ":princess:"
  }
  if (rank == "King") {
    return ":prince:"
  }
  return "?";
}

/// what emoji filled string to print when describing a card
function emojiString(card) {
  if (card.emoji === undefined || card.emoji === null || card.emoji == "") {
    return minorArcanaRankEmoji(card.number) + minorArcanaSuitEmoji(card.suit);
  }
  return card.emoji;
}

/// what is the rank + suit string to print when describing a card
function numberString(card) {
  if (card.suit == Suits.Major) {
    return card.number;
  }
  return card.number + " of " + card.suit;
}

/// what string prefix to print before describing a card
function cardPrefix(card) {
  return "*" + numberString(card) + "*: " + emojiString(card) + " " + card.name;
}

/// formatted for monospaced spreads, emojis will throw this off
function spreadFormattedCard(card) {
  if (card.suit === Suits.Major) {
    return numberString(card) + ": " + card.name;
  }
  return numberString(card)
}

/// what to print when describing a card in a particular inversion
function formattedCardString(card, inverted) {
  const inversionString = inverted ? ", Inverted" : "";
  let meaningString = (inverted ? card.invertedMeanings : card.meanings).join(", ");
  if (meaningString !== "") {
    meaningString = ": " + meaningString;
  }
  return cardPrefix(card) + inversionString + meaningString + ".";
}

/// what to print when describing a card out of context
function formattedCardFullDescription(card) {
  const upright = ".\n  | *Upright*: " + card.meanings.join(", ");
  const inverted = "\n  | *Inverted*: " + card.invertedMeanings.join(", ");
  return cardPrefix(card) + upright + inverted + "\n" + card.descriptionLink;
}

function formattedSpreadString(spread) {
  let cards = cardsForSpread(spread.numberOfCards);

  let annotatedCards = [];
  let maxCardStringSize = 0;
  for (let cardIdx = 0; cardIdx < spread.numberOfCards; cardIdx++) {
    const card = cards[cardIdx];
    const isInverted = spread.allowsInversion ? randomInversion() : false;
    const cardString = spreadFormattedCard(card);
    const cardStringSize = cardString.length + (isInverted ? 3 : 0);
    const inversionString = isInverted ? " 🔄" : "";
    maxCardStringSize = Math.max(cardStringSize, maxCardStringSize);
    annotatedCards.push({
      "card": card,
      "inverted": isInverted,
      "cardString": cardString + inversionString,
      "cardStringSize": cardStringSize
    });
  }
  return buildSpreadString(annotatedCards, spread, maxCardStringSize);
}

function cardsForSpread(count) {
  let allCardsKeys = Object.keys(allCards);
  shuffle(allCardsKeys);

  let cards = [];
  for (let idx = 0; idx < count; idx++) {
    cards.push(allCards[allCardsKeys.shift()]);
  }
  return cards;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}


function buildSpreadString(cards, spread, cardStringSize) {

  let spreadString = spread.name + "\n```\n";
  let currentNameLine = "";
  let currentPositionLine = "";
  let explainationFooter = "";

  const alignedStringWidth = Math.max(spread.longestItem, cardStringSize) + 2;
  const spacer = " ".repeat(alignedStringWidth);

  let halfSpacerCount = 0;
  const evenHalfSpacer = " ".repeat(Math.floor(alignedStringWidth / 2));
  const oddHalfSpacer = " ".repeat(Math.ceil(alignedStringWidth / 2));

  for (let tileIdx = 0; tileIdx < spread.shape.length; tileIdx++) {
    const tile = spread.shape.charAt(tileIdx);
    if (tile === " ") {
      currentNameLine += spacer;
      currentPositionLine += spacer;
      continue;
    }
    if (tile === "_") {
      const halfSpacer = (halfSpacerCount % 2 == 0) ? evenHalfSpacer : oddHalfSpacer;
      currentNameLine += halfSpacer;
      currentPositionLine += halfSpacer;
      halfSpacerCount += 1;
      continue;
    }
    if (tile === "\n") {
      spreadString += currentNameLine + "\n";
      spreadString += currentPositionLine + "\n\n";
      currentNameLine = "";
      currentPositionLine = "";
      halfSpacerCount = 0;
      continue;
    }
    const card = cards.shift();
    currentNameLine += padToWidth(card.cardString, card.cardStringSize, alignedStringWidth);
    currentPositionLine += padToWidth(spread.items[tile], spread.items[tile].length, alignedStringWidth);
    explainationFooter += "  " + formattedCardString(card.card, card.inverted) + "\n";
  }

  // footer
  spreadString += currentNameLine + "\n";
  spreadString += currentPositionLine + "```\n" + explainationFooter;

  return spreadString;
}

function padToWidth(string, stringWidth, width) {
  const paddingToAdd = width - stringWidth;
  const leftPadStr = " ".repeat(Math.floor(paddingToAdd / 2));
  const rightPadStr = " ".repeat(Math.ceil(paddingToAdd / 2));
  return leftPadStr + string + rightPadStr;
}

/// lowercase + strip "the"
function filterUserInput(userInputKey) {
  return userInputKey.toLowerCase().replace(/\s/g, '').replace('the', '');
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomCard() {
  const keys = Object.keys(allCards);
  const randomKey = keys[getRandomInt(keys.length)];
  return allCards[randomKey];
}

function randomInversion() {
  return Math.random() >= 0.5;
}

function describeSpreadIfAble(spreadHelper, spreadKey) {
  const spread = spreadHelper.spreadNamed(spreadKey);
  if (spread === undefined) {
    return;
  }
  return formattedSpreadString(spread);
}

function describeSuitIfAble(suitKey) {
  const suit = allSuitDescriptions[suitKey];
  if (suit === undefined) {
    return;
  }
  return suit;
}

function describeRankIfAble(rankKey) {
  const rank = allRankDescriptions[rankKey];
  if (rank === undefined) {
    return;
  }
  return rank;
}

function describeCardIfAble(cardKey) {
  const card = allCards[cardKey];
  if (card === undefined) {
    return;
  }
  return formattedCardFullDescription(card);
}

function oneOffResponse(userInput) {
  if (userInput === "shuffle") {
    return "Shuffle yourself buddy.";
  }

  if (userInput === "stop") {
    return "I can't.";
  }

  if (userInput === "hey") {
    return "Hey!";
  }

  if (userInput === "be nice") {
    return "That's up to you I'm afraid.";
  }

  if (userInput === "why") {
    return "Yikes, you think I know?";
  }
}

function randomCardString() {
  return formattedCardString(getRandomCard(), randomInversion());
}

module.exports = class TarotCards {

  constructor() {
    validateCards()
    this.spreadHelper = new Spreads();
  }

  describe(rawUserInput) {
    if (rawUserInput === undefined || rawUserInput === "") {
      return randomCardString();
    }
    //lowercased, stripping "the"
    const userInput = filterUserInput(rawUserInput);

    let response = oneOffResponse(userInput);
    if (response !== undefined) {
      return response;
    }

    //query
    if (userInput.charAt(userInput.length - 1) === "?") {
      return randomCardString();
    }

    if (userInput === "spreads") {
      return this.spreadHelper.allSpreadNames();
    }

    response = describeSpreadIfAble(this.spreadHelper, userInput);
    if (response !== undefined) {
      return response;
    }

    response = describeSuitIfAble(userInput);
    if (response !== undefined) {
      return response;
    }

    response = describeRankIfAble(userInput);
    if (response !== undefined) {
      return response;
    }

    response = describeCardIfAble(userInput);
    if (response !== undefined) {
      return response;
    }

    return "I don't know about `" + rawUserInput + "` at all.";
  }
}
