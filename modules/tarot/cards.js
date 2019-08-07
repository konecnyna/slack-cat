'use strict';

class Card {
  constructor(name, emoji, meanings, invertedMeanings, descriptionLink) {
    this.name = name;
    this.number = "MISSING"; // roman numeral, or plain number for minor arcana
    this.suit = "MISSING"; // suit or "major arcana"
    this.emoji = emoji || "MISSING";
    this.meanings = meanings || ["MISSING"];
    this.invertedMeanings = invertedMeanings || ["MISSING"];
    this.descriptionLink = descriptionLink || "MISSING";
  }
}

const allCards = {
  "fool": new Card("The Fool"),
  "magician": new Card("The Magician"),
  "highpriestess": new Card(),
  "empress": new Card(),
  "hierophant": new Card(),
  "lovers": new Card(),
  "chariot": new Card(),
  "strength": new Card(),
  "hermit": new Card(),
  "wheeloffortune": new Card(),
  "justice": new Card(),
  "hangedman": new Card(),
  "death": new Card(),
  "temperance": new Card(),
  "devil": new Card(),
  "tower": new Card(),
  "star": new Card(),
  "moon": new Card(),
  "sun": new Card(),
  "judgement": new Card(),
  "world": new Card(),
  
  "aceofcups": new Card(),
  "aceofwands": new Card(),
  "aceofswords": new Card(),
  "aceofpentacles": new Card(),

  "twoofcups": new Card(),
  "twoofwands": new Card(),
  "twoofswords": new Card(),
  "twoofpentacles": new Card(),

  "threeofcups": new Card(),
  "threeofwands": new Card(),
  "threeofswords": new Card(),
  "threeofpentacles": new Card(),

  "fourofcups": new Card(),
  "fourofwands": new Card(),
  "fourofswords": new Card(),
  "fourofpentacles": new Card(),

  "fiveofcups": new Card(),
  "fiveofwands": new Card(),
  "fiveofswords": new Card(),
  "fiveofpentacles": new Card(),

  "sixofcups": new Card(),
  "sixofwands": new Card(),
  "sixofswords": new Card(),
  "sixofpentacles": new Card(),

  "sevenofcups": new Card(),
  "sevenofwands": new Card(),
  "sevenofswords": new Card(),
  "sevenofpentacles": new Card(),

  "eightofcups": new Card(),
  "eightofwands": new Card(),
  "eightofswords": new Card(),
  "eightofpentacles": new Card(),

  "nineofcups": new Card(),
  "nineofwands": new Card(),
  "nineofswords": new Card(),
  "nineofpentacles": new Card(),

  "tenofcups": new Card(),
  "tenofwands": new Card(),
  "tenofswords": new Card(),
  "tenofpentacles": new Card(),

  "pageofcups": new Card(),
  "pageofwands": new Card(),
  "pageofswords": new Card(),
  "pageofpentacles": new Card(),

  "knightofcups": new Card(),
  "knightofwands": new Card(),
  "knightofswords": new Card(),
  "knightofpentacles": new Card(),

  "queenofcups": new Card(),
  "queenofwands": new Card(),
  "queenofswords": new Card(),
  "queenofpentacles": new Card(),

  "kingofcups": new Card(),
  "kingofwands": new Card(),
  "kingofswords": new Card(),
  "kingofpentacles": new Card()
  };

function formattedCardString(card, inverted) {
  let suffix = inverted ? ", Inverted" : "";
  return card.name + suffix;
}

function formattedCardFullDescription(card) {
  return card.name;
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
      return 'Card "'+userInputKey+'" does not exist. FORMATTED TO' + cardKey;
    }
    return formattedCardFullDescription(card);
  }
}

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
