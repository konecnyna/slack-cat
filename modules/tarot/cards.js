'use strict';


/*
:atrain::ctrain::etrain: of :wine_glass:
:atrain::ctrain::etrain: of :dagger_knife:
:atrain::ctrain::etrain: of :coin:
:atrain::ctrain::etrain: of :stick:
:two: of :wine_glass:
:two: of :dagger_knife:
:two: of :coin:
:two: of :stick:
:three: of :wine_glass:
:three: of :dagger_knife:
:three: of :coin:
:three: of :stick:
:four: of :wine_glass:
:four: of :dagger_knife:
:four:  of :coin:
:four: of :stick:
:five: of :wine_glass:
:five: of :dagger_knife:
:five: of :coin:
:five: of :stick:
:six: of :wine_glass:
:six: of :dagger_knife:
:six: of :coin:
:six: of :stick:
:seven: of :wine_glass:
:seven: of :dagger_knife:
:seven: of :coin:
:seven: of :stick:
:eight: of :wine_glass:
:eight: of :dagger_knife:
:eight: of :coin:
:eight: of :stick:
:nine: of :wine_glass:
:nine: of :dagger_knife:
:nine: of :coin:
:nine: of :stick:
:keycap_ten: of :wine_glass:
:keycap_ten: of :dagger_knife:
:keycap_ten: of :coin:
:keycap_ten: of :stick:
:horse_racing: of :wine_glass:
:horse_racing: of :dagger_knife:
:horse_racing: of :coin:
:horse_racing: of :stick:
:morty: of :wine_glass:
:morty: of :dagger_knife:
:morty: of :coin:
:morty: of :stick:
:princess: of :wine_glass:
:princess: of :dagger_knife:
:princess: of :coin:
:princess: of :stick:
:prince: of :wine_glass:
:prince: of :dagger_knife:
:prince: of :coin:
:prince: of :stick:

*/


class Card {
  constructor(name, number, suit, emoji, meanings, invertedMeanings, descriptionLink) {
    this.name = name;
    this.number = number; // roman numeral, or plain number for minor arcana
    this.suit = suit; // suit or "major arcana"
    this.emoji = emoji;
    this.meanings = meanings;
    this.invertedMeanings = invertedMeanings;
    this.descriptionLink = descriptionLink;
  }
}

const Suits = {
  Major: "Major",
  Swords: "Swords",
  Wands: "Wands",
  Pentacles: "Pentacles",
  Cups: "Cups"
};

const allCards = {
  "fool": new Card("The Fool", "0", Suits.Major, ":mardigrasparrot:", ["Innocence", "New beginnings", "Free spirit"], ["Recklessness", "Taken advantage of", "Inconsideration"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-fool-meaning-major-arcana-tarot-card-meanings"),

  "magician": new Card("The Magician", "I", Suits.Major, ":party-wizard:", ["Willpower", "Desire", "Creation", "Manifestation"], ["Trickery", "Illusions", "Out of touch"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-magician-meaning-major-arcana-tarot-card-meanings"),

  "highpriestess": new Card("The High Priestess", "II", Suits.Major, ":mage:", ["Intuitive", "Unconscious", "Inner voice"], ["Lack of center", "Lost inner voice", "Repressed feelings"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-high-priestess-meaning-major-arcana-tarot-card-meanings"),

  "empress": new Card("The Empress", "III", Suits.Major, ":beyonce:", ["Motherhood", "Fertility", "Nature"], ["Dependence", "Smothering", "Emptiness", "Nosiness"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-empress-meaning-major-arcana-tarot-card-meanings"),

  "emperor": new Card("The Emperor", "IV", Suits.Major, ":quaad:", ["Authority", "Structure", "Control", "Fatherhood"], ["Tyranny", "Rigidity", "Coldnes"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-emperor-meaning-major-arcana-tarot-card-meanings"),

  "hierophant": new Card("The Hierophant", "V", Suits.Major, ":male_mage:", ["Tradition", "Conformity", "Morality", "Ethics"], ["Rebellion", "Subversiveness", "New approaches"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-hierophant-meaning-major-arcana-tarot-card-meanings"),

  "lovers": new Card("The Lovers", "VI", Suits.Major, ":man-with-bunny-ears-partying:", ["Partnerships", "Duality", "Union"], ["Loss of balance", "One-sidedness", "Disharmony"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-lovers-meaning-major-arcana-tarot-card-meanings"),

  "chariot": new Card("The Chariot", "VII", Suits.Major, ":steam_locomotive:", ["Direction", "Control", "Willpower"], ["Lack of control", "Lack of direction", "Aggression"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-chariot-meaning-major-arcana-tarot-card-meanings"),

  "strength": new Card("Strength", "VIII", Suits.Major, ":muscle:", ["Inner strength", "Bravery", "Compassion", "Focus"], ["Self doubt", "Weakness", "Insecurity"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/strength-meaning-major-arcana-tarot-card-meanings"),

  "hermit": new Card("The Hermit", "IX", Suits.Major, ":lantern:", ["Contemplation", "Search for truth", "Inner guidance"], ["Loneliness", "Isolation", "Lost your way"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-hermit-meaning-major-arcana-tarot-card-meanings"),

  "wheeloffortune": new Card("The Wheel of Fortune", "X", Suits.Major, ":wheelofdeath:", ["Change", "Cycles", "Inevitable fate"], ["No control", "Clinging to control", "Bad luck"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-wheel-of-fortune-meaning-major-arcana-tarot-card-meanings"),

  "justice": new Card("Justice", "XI", Suits.Major, ":scales:", ["Cause and effect", "Clarity", "Truth"], ["Dishonesty", "Unaccountability", "Unfairness"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/justice-meaning-major-arcana-tarot-card-meanings"),

  "hangedman": new Card("The Hanged Man", "XII", Suits.Major, ":waluigi-tpose::latin_cross:", ["Sacrifice", "Release", "Martyrdom"], ["Stalling", "Needless sacrifice", "Fear of sacrifice"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-hanged-man-meaning-major-arcana-tarot-card-meanings"),

  "death": new Card("Death", "XIII", Suits.Major, ":skull_and_crossbones:", ["End of cycle", "Beginnings", "Change", "Metamorphosis"], ["Fear of change", "Holding on", "Stagnation", "Decay"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/death-meaning-major-arcana-tarot-card-meanings"),

  "temperance": new Card("Temperance", "XIV", Suits.Major, ":angelparrot:", ["Middle path", "Patience", "Finding meaning"], ["Extremes", "Excess", "Lack of balance"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/temperance-meaning-major-arcana-tarot-card-meanings"),

  "devil": new Card("The Devil", "XV", Suits.Major, ":devil-parrot:", ["Addiction", "Materialism", "Playfulness"], ["Freedom", "Release", "Restoring control"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-devil-meaning-major-arcana-tarot-card-meanings"),

  "tower": new Card("The Tower", "XVI", Suits.Major, ":european_castle::lightning:", ["Sudden upheaval", "Broken pride", "Disaster"], ["Disaster avoided", "Delayed disaster", "Fear of suffering"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-tower-meaning-major-arcana-tarot-card-meanings"),

  "star": new Card("The Star", "XVII", Suits.Major, ":star2:", ["Hope", "Faith", "Rejuvenation"], ["Faithlessness", "Discouragement", "Insecurity"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-star-meaning-major-arcana-tarot-card-meanings"),

  "moon": new Card("The Moon", "XVIII", Suits.Major, ":moon:", ["Unconscious", "Illusions", "Intuition"], ["Confusion", "Fear", "Misinterpretation"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-moon-meaning-major-arcana-tarot-card-meanings"),

  "sun": new Card("The Sun", "XIX", Suits.Major, ":sun_with_face:", ["Joy", "Success", "Celebration", "Positivity"], ["Negativity", "Depression", "Sadness"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-sun-meaning-major-arcana-tarot-card-meanings"),

  "judgement": new Card("Judgement", "XX", Suits.Major, ":doot:", ["Reflection", "Reckoning", "Awakening"], ["Lack of self awareness", "Doubt", "Self loathing"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/judgement-meaning-major-arcana-tarot-card-meanings"),

  "world": new Card("The World", "XXI", Suits.Major, ":earth_americas:", ["Fulfillment", "Harmony", "Completion"], ["Incompletion", "No closure"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-world-meaning-major-arcana-tarot-card-meanings"),

  "aceofcups": new Card("The Ace of Cups", "Ace", Suits.Cups, "", ["new feelings", "spirituality", "intuition"], ["emotional loss", "blocked creativity", "emptiness"], "DescLinkStub"),
  "aceofwands": new Card("The Ace of Wands", "Ace", Suits.Wands, "", ["creation", "willpower", "inspiration", "desire"], ["lack of energy", "lack of passion", "boredom"], "DescLinkStub"),
  "aceofswords": new Card("The Ace of Swords", "Ace", Suits.Swords, "", ["breakthrough", "clarity", "sharp mind"], ["confusion", "brutality", "chaos"], "DescLinkStub"),
  "aceofpentacles": new Card("The Ace of Pentacles", "Ace", Suits.Pentacles, "", ["opportunity", "prosperity", "new venture"], ["lost opportunity", "missed chance", "bad investment"], "DescLinkStub"),

  "twoofcups": new Card("The Two of Cups", "2", Suits.Cups, "", ["unity", "partnership", "connection"], ["imbalance", "broken communication", "tension"], "DescLinkStub"),
  "twoofwands": new Card("The Two of Wands", "2", Suits.Wands, "", ["planning", "making decisions", "leaving home"], ["fear of change", "playing safe", "bad planning"], "DescLinkStub"),
  "twoofswords": new Card("The Two of Swords", "2", Suits.Swords, "", ["difficult choices", "indecision", "stalemate"], ["lesser of two evils", "no right choice", "confusion"], "DescLinkStub"),
  "twoofpentacles": new Card("The Two of Pentacles", "2", Suits.Pentacles, "", ["balancing decisions", "priorities", "adapting to change"], ["loss of balance", "disorganized", "overwhelmed"], "DescLinkStub"),

  "threeofcups": new Card("The Three of Cups", "3", Suits.Cups, "", ["friendship", "community", "happiness"], ["overindulgence", "gossip", "isolation"], "DescLinkStub"),
  "threeofwands": new Card("The Three of Wands", "3", Suits.Wands, "", ["looking ahead", "expansion", "rapid growth"], ["obstacles", "delays", "frustration"], "DescLinkStub"),
  "threeofswords": new Card("The Three of Swords", "3", Suits.Swords, "", ["heartbreak", "suffering", "grief"], ["recovery", "forgiveness", "moving on"], "DescLinkStub"),
  "threeofpentacles": new Card("The Three of Pentacles", "3", Suits.Pentacles, "", ["teamwork", "collaboration", "building"], ["lack of teamwork", "disorganized", "group conflict"], "DescLinkStub"),

  "fourofcups": new Card("The Four of Cups", "4", Suits.Cups, "", ["apathy", "contemplation", "disconnectedness"], ["sudden awareness", "choosing happiness", "acceptance"], "DescLinkStub"),
  "fourofwands": new Card("The Four of Wands", "4", Suits.Wands, "", ["community", "home", "celebration"], ["lack of support", "transience", "home conflicts"], "DescLinkStub"),
  "fourofswords": new Card("The Four of Swords", "4", Suits.Swords, "", ["rest", "restoration", "contemplation"], ["restlessness", "burnout", "stress"], "DescLinkStub"),
  "fourofpentacles": new Card("The Four of Pentacles", "4", Suits.Pentacles, "", ["conservation", "frugality", "security"], ["greediness", "stinginess", "possessiveness"], "DescLinkStub"),

  "fiveofcups": new Card("The Five of Cups", "5", Suits.Cups, "", ["loss", "grief", "self-pity"], ["acceptance", "moving on", "finding peace"], "DescLinkStub"),
  "fiveofwands": new Card("The Five of Wands", "5", Suits.Wands, "", ["competition", "rivalry", "conflict"], ["avoiding conflict", "respecting differences"], "DescLinkStub"),
  "fiveofswords": new Card("The Five of Swords", "5", Suits.Swords, "", ["unbridled ambition", "win at all costs", "sneakiness"], ["lingering resentment", "desire to reconcile", "forgiveness"], "DescLinkStub"),
  "fiveofpentacles": new Card("The Five of Pentacles", "5", Suits.Pentacles, "", ["need", "poverty", "insecurity"], ["recovery", "charity", "improvement"], "DescLinkStub"),

  "sixofcups": new Card("The Six of Cups", "6", Suits.Cups, "", ["familiarity", "happy memories", "healing"], ["moving forward", "leaving home", "independence"], "DescLinkStub"),
  "sixofwands": new Card("The Six of Wands", "6", Suits.Wands, "", ["victory", "success", "public reward"], ["excess pride", "lack of recognition", "punishment"], "DescLinkStub"),
  "sixofswords": new Card("The Six of Swords", "6", Suits.Swords, "", ["transition", "leaving behind", "moving on"], ["emotional baggage", "unresolved issues", "resisting transition"], "DescLinkStub"),
  "sixofpentacles": new Card("The Six of Pentacles", "6", Suits.Pentacles, "", ["charity", "generosity", "sharing"], ["strings attached", "stinginess", "power and domination"], "DescLinkStub"),

  "sevenofcups": new Card("The Seven of Cups", "7", Suits.Cups, "", ["searching for purpose", "choices", "daydreaming"], ["lack of purpose", "diversion", "confusion"], "DescLinkStub"),
  "sevenofwands": new Card("The Seven of Wands", "7", Suits.Wands, "", ["perseverance", "defensive", "maintaining control"], ["give up", "destroyed confidence", "overwhelmed"], "DescLinkStub"),
  "sevenofswords": new Card("The Seven of Swords", "7", Suits.Swords, "", ["deception", "trickery", "tactics and strategy"], ["coming clean", "rethinking approach", "deception"], "DescLinkStub"),
  "sevenofpentacles": new Card("The Seven of Pentacles", "7", Suits.Pentacles, "", ["hard work", "perseverance", "diligence"], ["work without results", "distractions", "lack of rewards"], "DescLinkStub"),

  "eightofcups": new Card("The Eight of Cups", "8", Suits.Cups, "", ["walking away", "disillusionment", "leaving behind"], ["avoidance", "fear of change", "fear of loss"], "DescLinkStub"),
  "eightofwands": new Card("The Eight of Wands", "8", Suits.Wands, "", ["rapid action", "movement", "quick decisions"], ["panic", "waiting", "slowdown"], "DescLinkStub"),
  "eightofswords": new Card("The Eight of Swords", "8", Suits.Swords, "", ["imprisonment", "entrapment", "self-victimization"], ["self acceptance", "new perspective", "freedom"], "DescLinkStub"),
  "eightofpentacles": new Card("The Eight of Pentacles", "8", Suits.Pentacles, "", ["apprenticeship", "passion", "high standards"], ["lack of passion", "uninspired", "no motivation"], "DescLinkStub"),

  "nineofcups": new Card("The Nine of Cups", "9", Suits.Cups, "", ["satisfaction", "emotional stability", "luxury"], ["lack of inner joy", "smugness", "dissatisfaction"], "DescLinkStub"),
  "nineofwands": new Card("The Nine of Wands", "9", Suits.Wands, "", ["resilience", "grit", "last stand"], ["exhaustion", "fatigue", "questioning motivations"], "DescLinkStub"),
  "nineofswords": new Card("The Nine of Swords", "9", Suits.Swords, "", ["anxiety", "hopelessness", "trauma"], ["hope", "reaching out", "despair"], "DescLinkStub"),
  "nineofpentacles": new Card("The Nine of Pentacles", "9", Suits.Pentacles, "", ["fruits of labor", "rewards", "luxury"], ["reckless spending", "living beyond means", "false success"], "DescLinkStub"),

  "tenofcups": new Card("The Ten of Cups", "10", Suits.Cups, "", ["inner happiness", "fulfillment", "dreams coming true"], ["shattered dreams", "broken family", "domestic disharmony"], "DescLinkStub"),
  "tenofwands": new Card("The Ten of Wands", "10", Suits.Wands, "", ["accomplishment", "responsibility", "burden"], ["inability to delegate", "overstressed", "burnt out"], "DescLinkStub"),
  "tenofswords": new Card("The Ten of Swords", "10", Suits.Swords, "", ["failure", "collapse", "defeat"], ["can't get worse", "only upwards", "inevitable end"], "DescLinkStub"),
  "tenofpentacles": new Card("The Ten of Pentacles", "10", Suits.Pentacles, "", ["legacy", "culmination", "inheritance"], ["fleeting success", "lack of stability", "lack of resources"], "DescLinkStub"),

  "pageofcups": new Card("The Page of Cups", "Page", Suits.Cups, "", ["happy surprise", "dreamer", "sensitivity"], ["emotional immaturity", "insecurity", "disappointment"], "DescLinkStub"),
  "pageofwands": new Card("The Page of Wands", "Page", Suits.Wands, "", ["exploration", "excitement", "freedom"], ["lack of direction", "procrastination", "creating conflict"], "DescLinkStub"),
  "pageofswords": new Card("The Page of Swords", "Page", Suits.Swords, "", ["curiosity", "restlessness", "mental energy"], ["deception", "manipulation", "all talk"], "DescLinkStub"),
  "pageofpentacles": new Card("The Page of Pentacles", "Page", Suits.Pentacles, "", ["ambition", "desire", "diligence"], ["lack of commitment", "greediness", "laziness"], "DescLinkStub"),

  "knightofcups": new Card("The Knight of Cups", "Knight", Suits.Cups, "", ["following the heart", "idealist", "romantic"], ["moodiness", "disappointment"], "DescLinkStub"),
  "knightofwands": new Card("The Knight of Wands", "Knight", Suits.Wands, "", ["action", "adventure", "fearlessness"], ["anger", "impulsiveness", "recklessness"], "DescLinkStub"),
  "knightofswords": new Card("The Knight of Swords", "Knight", Suits.Swords, "", ["action", "impulsiveness", "defending beliefs"], ["no direction", "disregard for consequences", "unpredictability"], "DescLinkStub"),
  "knightofpentacles": new Card("The Knight of Pentacles", "Knight", Suits.Pentacles, "", ["efficiency", "hard work", "responsibility"], ["laziness", "obsessiveness", "work without reward"], "DescLinkStub"),

  "queenofcups": new Card("The Queen of Cups", "Queen", Suits.Cups, "", ["compassion", "calm", "comfort"], ["martyrdom", "insecurity", "dependence"], "DescLinkStub"),
  "queenofwands": new Card("The Queen of Wands", "Queen", Suits.Wands, "", ["courage", "determination", "joy"], ["selfishness", "jealousy", "insecurities"], "DescLinkStub"),
  "queenofswords": new Card("The Queen of Swords", "Queen", Suits.Swords, "", ["complexity", "perceptiveness", "clear mindedness"], ["cold hearted", "cruel", "bitterness"], "DescLinkStub"),
  "queenofpentacles": new Card("The Queen of Pentacles", "Queen", Suits.Pentacles, "", ["practicality", "creature comforts", "financial security"], ["self-centeredness", "jealousy", "smothering"], "DescLinkStub"),

  "kingofcups": new Card("The King of Cups", "King", Suits.Cups, "", ["compassion", "control", "balance"], ["coldness", "moodiness", "bad advice"], "DescLinkStub"),
  "kingofwands": new Card("The King of Wands", "King", Suits.Wands, "", ["big picture", "leader", "overcoming challenges"], ["impulsive", "overbearing", "unachievable expectations"], "DescLinkStub"),
  "kingofswords": new Card("The King of Swords", "King", Suits.Swords, "", ["head over heart", "discipline", "truth"], ["manipulative", "cruel", "weakness"], "DescLinkStub"),
  "kingofpentacles": new Card("The King of Pentacles", "King", Suits.Pentacles, "", ["abundance", "prosperity", "security"], ["greed", "indulgence", "sensuality"], "DescLinkStub")
};

function validateCards() {
  const allCardKeys = Object.keys(allCards);
  if (allCardKeys.length != 78) {
    console.log("Some cards are missing");
  }

  allCardKeys.forEach(function(cardKey){
    const card = allCards[cardKey];
    if (card.name === undefined) {
      console.log("Card "+cardKey+" is missing a name");
      card.name = "Unknown";
    }

    if (card.number === undefined) {
      console.log("Card "+cardKey+" is missing a number");
      card.number = "Unknown";
    }

    if (card.suit === undefined) {
      console.log("Card "+cardKey+" is missing a suit");
      card.suit = "Unknown";
    } else if (card.suit != Suits.Major &&
        card.suit != Suits.Wands &&
        card.suit != Suits.Swords &&
        card.suit != Suits.Cups &&
        card.suit != Suits.Pentacles) {
          console.log("Card "+cardKey+" has an unhandled suit of " + card.suit);
    }

    if (card.emoji === undefined) {
      console.log("Card "+cardKey+" is missing an emoji");
      card.emoji = "Unknown";
    }

    if (card.meanings === undefined) {
      console.log("Card "+cardKey+" is missing an array of upright meanings");
      card.meanings = ["Unknown"];
    } else if (card.meanings.length === 0) {
      console.log("Card "+cardKey+" has an empty an array of inverted meanings");
    } else if (card.meanings.length === 1 && card.meanings[0] == "UprightMeaningStub") {
      console.log("Card "+cardKey+" has unimplemented meanings");
      card.meanings = [];
    }

    if (card.invertedMeanings === undefined) {
      console.log("Card "+cardKey+" is missing an array of inverted meanings");
      card.invertedMeanings = ["Unknown"];
    } else if (card.invertedMeanings.length === 0) {
      console.log("Card "+cardKey+" has an empty an array of inverted meanings");
    } else if (card.invertedMeanings.length === 1 && card.invertedMeanings[0] == "InvertedMeaningStub") {
      console.log("Card "+cardKey+" has unimplemented inverted meanings");
      card.invertedMeanings = [];
    }
  });
}

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

function emojiString(card) {
  if (card.emoji === undefined || card.emoji === null || card.emoji == "") {
    return minorArcanaRankEmoji(card.number) + " of " + minorArcanaSuitEmoji(card.suit);
  }
  return card.emoji;
}

function numberString(card) {
    if (card.suit == Suits.Major) {
      return card.number;
    }
    return card.number + " of " + card.suit;
}

function cardPrefix(card) {
  return "*" + numberString(card) + "*: " + emojiString(card) + " " + card.name;
}

function formattedCardString(card, inverted) {
  const inversionString = inverted ? ", Inverted" : "";
  let meaningString = (inverted ? card.meanings : card.invertedMeanings).join(", ");
  if (meaningString !== "") {
    meaningString = ": " + meaningString;
  }
  return cardPrefix(card) + inversionString + meaningString + ".";
}

function formattedCardFullDescription(card) {
  return cardPrefix(card) + ". *Upright*: " + card.meanings.join(", ") + " | *Inverted*: " + card.invertedMeanings.join(", ") + ".";
}

function getCardKey(userInputKey) {
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

module.exports = class TarotCards {

  constructor() {
    validateCards()
  }

  random() {
    return formattedCardString(getRandomCard(), randomInversion());
  }

  cardDescription(userInputKey) {
    if (userInputKey === undefined || userInputKey === "") {
      return "I didn't understand that at all.";
    }
    const cardKey = getCardKey(userInputKey);
    const card = allCards[cardKey];
    if (card === undefined) {
      return 'Card "'+userInputKey+'" does not exist.';
    }
    return formattedCardFullDescription(card);
  }
}
