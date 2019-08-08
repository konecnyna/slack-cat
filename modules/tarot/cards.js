'use strict';


/*
:000: : :mardigrasparrot: The Fool. Innocence, new beginnings, free spirit | Recklessness, taken advantage of, inconsideration
:1train: : :party-wizard: The Magician. Willpower, desire, creation, manifestation | Trickery, illusions, out of touch
:2train: : :mage: The High Priestess. Intuitive, unconscious, inner voice | Lack of center, lost inner voice, repressed feelings
:3train: : :beyonce: The Empress. Motherhood, fertility, nature | Dependence, smothering, emptiness, nosiness
:4train: : :quaad: The Emperor. Authority, structure, control, fatherhood | Tyranny, rigidity, coldness
:5train: : :male_mage: The Hierophant. Tradition, conformity, morality, ethics | Rebellion, subversiveness, new approaches
:6train: : :man-with-bunny-ears-partying: The Lovers. Partnerships, duality, union | Loss of balance, one-sidedness, disharmony
:7train: : :steam_locomotive: The Chariot. Direction, control, willpower | Lack of control, lack of direction, aggression
:eight: : :muscle: Strength. Inner strength, bravery, compassion, focus | Self doubt, weakness, insecurity
:9train: : :lantern: The Hermit. Contemplation, search for truth, inner guidance | Loneliness, isolation, lost your way
:keycap_ten: : :wheelofdeath: Wheel of Fortune. Change, cycles, inevitable fate | No control, clinging to control, bad luck
:1train::1train: : :scales: Justice. Cause and effect, clarity, truth | Dishonesty, unaccountability, unfairness
:1train::2train: : :waluigi-tpose::latin_cross: The Hanged Man. Sacrifice, release, martyrdom | Stalling, needless sacrifice, fear of sacrifice
:1train::3train: : :skull_and_crossbones: Death. End of cycle, beginnings, change, metamorphosis | Fear of change, holding on, stagnation, decay
:1train::4train: : :angelparrot: Temperance. Middle path, patience, finding meaning | Extremes, excess, lack of balance
:1train::5train: : :devil-parrot: The Devil. Addiction, materialism, playfulness | Freedom, release, restoring control
:1train::6train: : :european_castle: :lightning: The Tower. Sudden upheaval, broken pride, disaster | Disaster avoided, delayed disaster, fear of suffering
:1train::7train: : :star2: The Star. Hope, faith, rejuvenation | Faithlessness, discouragement, insecurity
:one::eight: : :moon: The Moon. Unconscious, illusions, intuition | Confusion, fear, misinterpretation
:1train::9train: : :sun_with_face: The Sun. Joy, success, celebration, positivity, | negativity, depression, sadness
:two::zero: : :doot: Judgement. Reflection, reckoning, awakening | Lack of self awareness, doubt, self loathing
:2train::1train: : :earth_americas: The World. Fulfillment, harmony, completion | Incompletion, no closure
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

  "emperor": new Card("The Emperor", "IV", Suits.Major, ":quaad:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-emperor-meaning-major-arcana-tarot-card-meanings"),

  "hierophant": new Card("The Hierophant", "V", Suits.Major, ":male_mage:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-hierophant-meaning-major-arcana-tarot-card-meanings"),

  "lovers": new Card("The Lovers", "VI", Suits.Major, ":man-with-bunny-ears-partying:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-lovers-meaning-major-arcana-tarot-card-meanings"),

  "chariot": new Card("The Chariot", "VII", Suits.Major, ":steam_locomotive:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-chariot-meaning-major-arcana-tarot-card-meanings"),

  "strength": new Card("Strength", "VIII", Suits.Major, ":muscle:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/strength-meaning-major-arcana-tarot-card-meanings"),

  "hermit": new Card("The Hermit", "IX", Suits.Major, ":lantern:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-hermit-meaning-major-arcana-tarot-card-meanings"),

  "wheeloffortune": new Card("The Wheel of Fortune", "X", Suits.Major, ":wheelofdeath:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-wheel-of-fortune-meaning-major-arcana-tarot-card-meanings"),

  "justice": new Card("Justice", "XI", Suits.Major, ":scales:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/justice-meaning-major-arcana-tarot-card-meanings"),

  "hangedman": new Card("The Hanged Man", "XII", Suits.Major, ":waluigi-tpose::latin_cross:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-hanged-man-meaning-major-arcana-tarot-card-meanings"),

  "death": new Card("Death", "XIII", Suits.Major, ":skull_and_crossbones:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/death-meaning-major-arcana-tarot-card-meanings"),

  "temperance": new Card("Temperance", "XIV", Suits.Major, ":angelparrot:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/temperance-meaning-major-arcana-tarot-card-meanings"),

  "devil": new Card("The Devil", "XV", Suits.Major, ":devil-parrot:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-devil-meaning-major-arcana-tarot-card-meanings"),

  "tower": new Card("The Tower", "XVI", Suits.Major, ":european_castle::lightning:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-tower-meaning-major-arcana-tarot-card-meanings"),

  "star": new Card("The Star", "XVII", Suits.Major, ":star2:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-star-meaning-major-arcana-tarot-card-meanings"),

  "moon": new Card("The Moon", "XVIII", Suits.Major, ":moon:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-moon-meaning-major-arcana-tarot-card-meanings"),

  "sun": new Card("The Sun", "XIX", Suits.Major, ":sun_with_face:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-sun-meaning-major-arcana-tarot-card-meanings"),

  "judgement": new Card("Judgement", "XX", Suits.Major, ":doot:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/judgement-meaning-major-arcana-tarot-card-meanings"),

  "world": new Card("The World", "XXI", Suits.Major, ":earth_americas:", ["UprightMeaningStub"], ["InvertedMeaningStub"], "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-world-meaning-major-arcana-tarot-card-meanings"),

  "aceofcups": new Card("The Ace of Cups", "Ace", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "aceofwands": new Card("The Ace of Wands", "Ace", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "aceofswords": new Card("The Ace of Swords", "Ace", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "aceofpentacles": new Card("The Ace of Pentacles", "Ace", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "twoofcups": new Card("The Two of Cups", "2", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "twoofwands": new Card("The Two of Wands", "2", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "twoofswords": new Card("The Two of Swords", "2", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "twoofpentacles": new Card("The Two of Pentacles", "2", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "threeofcups": new Card("The Three of Cups", "3", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "threeofwands": new Card("The Three of Wands", "3", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "threeofswords": new Card("The Three of Swords", "3", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "threeofpentacles": new Card("The Three of Pentacles", "3", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "fourofcups": new Card("The Four of Cups", "4", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "fourofwands": new Card("The Four of Wands", "4", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "fourofswords": new Card("The Four of Swords", "4", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "fourofpentacles": new Card("The Four of Pentacles", "4", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "fiveofcups": new Card("The Five of Cups", "5", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "fiveofwands": new Card("The Five of Wands", "5", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "fiveofswords": new Card("The Five of Swords", "5", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "fiveofpentacles": new Card("The Five of Pentacles", "5", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "sixofcups": new Card("The Six of Cups", "6", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "sixofwands": new Card("The Six of Wands", "6", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "sixofswords": new Card("The Six of Swords", "6", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "sixofpentacles": new Card("The Six of Pentacles", "6", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "sevenofcups": new Card("The Seven of Cups", "7", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "sevenofwands": new Card("The Seven of Wands", "7", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "sevenofswords": new Card("The Seven of Swords", "7", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "sevenofpentacles": new Card("The Seven of Pentacles", "7", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "eightofcups": new Card("The Eight of Cups", "8", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "eightofwands": new Card("The Eight of Wands", "8", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "eightofswords": new Card("The Eight of Swords", "8", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "eightofpentacles": new Card("The Eight of Pentacles", "8", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "nineofcups": new Card("The Nine of Cups", "9", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "nineofwands": new Card("The Nine of Wands", "9", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "nineofswords": new Card("The Nine of Swords", "9", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "nineofpentacles": new Card("The Nine of Pentacles", "9", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "tenofcups": new Card("The Ten of Cups", "10", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "tenofwands": new Card("The Ten of Wands", "10", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "tenofswords": new Card("The Ten of Swords", "10", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "tenofpentacles": new Card("The Ten of Pentacles", "10", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "pageofcups": new Card("The Page of Cups", "Page", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "pageofwands": new Card("The Page of Wands", "Page", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "pageofswords": new Card("The Page of Swords", "Page", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "pageofpentacles": new Card("The Page of Pentacles", "Page", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "knightofcups": new Card("The Knight of Cups", "Knight", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "knightofwands": new Card("The Knight of Wands", "Knight", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "knightofswords": new Card("The Knight of Swords", "Knight", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "knightofpentacles": new Card("The Knight of Pentacles", "Knight", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "queenofcups": new Card("The Queen of Cups", "Queen", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "queenofwands": new Card("The Queen of Wands", "Queen", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "queenofswords": new Card("The Queen of Swords", "Queen", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "queenofpentacles": new Card("The Queen of Pentacles", "Queen", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),

  "kingofcups": new Card("The King of Cups", "King", Suits.Cups, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "kingofwands": new Card("The King of Wands", "King", Suits.Wands, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "kingofswords": new Card("The King of Swords", "King", Suits.Swords, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub"),
  "kingofpentacles": new Card("The King of Pentacles", "King", Suits.Pentacles, "", ["UprightMeaningStub"], ["InvertedMeaningStub"], "DescLinkStub")
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
  let meaningString = (inverted ? card.meanings : card.invertedMeanings).join(",");
  if (meaningString !== "") {
    meaningString = ": " + meaningString;
  }
  return cardPrefix(card) + inversionString + meaningString + ".";
}

function formattedCardFullDescription(card) {
  return cardPrefix(card) + ". *Upright*: " + card.meanings.join(",") + " | *Inverted*: " + card.invertedMeanings.join(",") + ".";
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
