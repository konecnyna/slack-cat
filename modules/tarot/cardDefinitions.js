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
  "fool": new Card("The Fool", "0", Suits.Major, ":mardigrasparrot:",
    ["Innocence", "New beginnings", "Free spirit"], ["Recklessness", "Taken advantage of", "Inconsideration"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-fool-meaning-major-arcana-tarot-card-meanings"),

  "magician": new Card("The Magician", "I", Suits.Major, ":party-wizard:",
    ["Willpower", "Desire", "Creation", "Manifestation"], ["Trickery", "Illusions", "Out of touch"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-magician-meaning-major-arcana-tarot-card-meanings"),

  "highpriestess": new Card("The High Priestess", "II", Suits.Major, ":mage:",
    ["Intuitive", "Unconscious", "Inner voice"], ["Lack of center", "Lost inner voice", "Repressed feelings"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-high-priestess-meaning-major-arcana-tarot-card-meanings"),

  "empress": new Card("The Empress", "III", Suits.Major, ":beyonce:",
    ["Motherhood", "Fertility", "Nature"], ["Dependence", "Smothering", "Emptiness", "Nosiness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-empress-meaning-major-arcana-tarot-card-meanings"),

  "emperor": new Card("The Emperor", "IV", Suits.Major, ":quaad:",
    ["Authority", "Structure", "Control", "Fatherhood"], ["Tyranny", "Rigidity", "Coldness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-emperor-meaning-major-arcana-tarot-card-meanings"),

  "hierophant": new Card("The Hierophant", "V", Suits.Major, ":male_mage:",
    ["Tradition", "Conformity", "Morality", "Ethics"], ["Rebellion", "Subversiveness", "New approaches"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-hierophant-meaning-major-arcana-tarot-card-meanings"),

  "lovers": new Card("The Lovers", "VI", Suits.Major, ":man-with-bunny-ears-partying:",
    ["Partnerships", "Duality", "Union"], ["Loss of balance", "One-sidedness", "Disharmony"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-lovers-meaning-major-arcana-tarot-card-meanings"),

  "chariot": new Card("The Chariot", "VII", Suits.Major, ":steam_locomotive:",
    ["Direction", "Control", "Willpower"], ["Lack of control", "Lack of direction", "Aggression"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-chariot-meaning-major-arcana-tarot-card-meanings"),

  "strength": new Card("Strength", "VIII", Suits.Major, ":muscle:",
    ["Inner strength", "Bravery", "Compassion", "Focus"], ["Self doubt", "Weakness", "Insecurity"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/strength-meaning-major-arcana-tarot-card-meanings"),

  "hermit": new Card("The Hermit", "IX", Suits.Major, ":lantern:",
    ["Contemplation", "Search for truth", "Inner guidance"], ["Loneliness", "Isolation", "Lost your way"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-hermit-meaning-major-arcana-tarot-card-meanings"),

  "wheeloffortune": new Card("The Wheel of Fortune", "X", Suits.Major, ":wheelofdeath:",
    ["Change", "Cycles", "Inevitable fate"], ["No control", "Clinging to control", "Bad luck"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-wheel-of-fortune-meaning-major-arcana-tarot-card-meanings"),

  "justice": new Card("Justice", "XI", Suits.Major, ":scales:",
    ["Cause and effect", "Clarity", "Truth"], ["Dishonesty", "Unaccountability", "Unfairness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/justice-meaning-major-arcana-tarot-card-meanings"),

  "hangedman": new Card("The Hanged Man", "XII", Suits.Major, ":waluigi-tpose::latin_cross:",
    ["Sacrifice", "Release", "Martyrdom"], ["Stalling", "Needless sacrifice", "Fear of sacrifice"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-hanged-man-meaning-major-arcana-tarot-card-meanings"),

  "death": new Card("Death", "XIII", Suits.Major, ":skull_and_crossbones:",
    ["End of cycle", "Beginnings", "Change", "Metamorphosis"], ["Fear of change", "Holding on", "Stagnation", "Decay"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/death-meaning-major-arcana-tarot-card-meanings"),

  "temperance": new Card("Temperance", "XIV", Suits.Major, ":angelparrot:",
    ["Middle path", "Patience", "Finding meaning"], ["Extremes", "Excess", "Lack of balance"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/temperance-meaning-major-arcana-tarot-card-meanings"),

  "devil": new Card("The Devil", "XV", Suits.Major, ":devil-parrot:",
    ["Addiction", "Materialism", "Playfulness"], ["Freedom", "Release", "Restoring control"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-devil-meaning-major-arcana-tarot-card-meanings"),

  "tower": new Card("The Tower", "XVI", Suits.Major, ":european_castle::lightning:",
    ["Sudden upheaval", "Broken pride", "Disaster"], ["Disaster avoided", "Delayed disaster", "Fear of suffering"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-tower-meaning-major-arcana-tarot-card-meanings"),

  "star": new Card("The Star", "XVII", Suits.Major, ":star2:",
    ["Hope", "Faith", "Rejuvenation"], ["Faithlessness", "Discouragement", "Insecurity"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-star-meaning-major-arcana-tarot-card-meanings"),

  "moon": new Card("The Moon", "XVIII", Suits.Major, ":moon:",
    ["Unconscious", "Illusions", "Intuition"], ["Confusion", "Fear", "Misinterpretation"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-moon-meaning-major-arcana-tarot-card-meanings"),

  "sun": new Card("The Sun", "XIX", Suits.Major, ":sun_with_face:",
    ["Joy", "Success", "Celebration", "Positivity"], ["Negativity", "Depression", "Sadness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-sun-meaning-major-arcana-tarot-card-meanings"),

  "judgement": new Card("Judgement", "XX", Suits.Major, ":doot:",
    ["Reflection", "Reckoning", "Awakening"], ["Lack of self awareness", "Doubt", "Self loathing"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/judgement-meaning-major-arcana-tarot-card-meanings"),

  "world": new Card("The World", "XXI", Suits.Major, ":earth_americas:",
    ["Fulfillment", "Harmony", "Completion"], ["Incompletion", "No closure"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/the-world-meaning-major-arcana-tarot-card-meanings"),

  "aceofcups": new Card("The Ace of Cups", "Ace", Suits.Cups, "",
    ["new feelings", "spirituality", "intuition"], ["emotional loss", "blocked creativity", "emptiness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/ace-of-cups-meaning-tarot-card-meanings"),

  "aceofwands": new Card("The Ace of Wands", "Ace", Suits.Wands, "",
    ["creation", "willpower", "inspiration", "desire"], ["lack of energy", "lack of passion", "boredom"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/ace-of-wands-meaning-tarot-card-meanings"),

  "aceofswords": new Card("The Ace of Swords", "Ace", Suits.Swords, "",
    ["breakthrough", "clarity", "sharp mind"], ["confusion", "brutality", "chaos"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/ace-of-swords-meaning-tarot-card-meanings"),

  "aceofpentacles": new Card("The Ace of Pentacles", "Ace", Suits.Pentacles, "",
    ["opportunity", "prosperity", "new venture"], ["lost opportunity", "missed chance", "bad investment"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/ace-of-pentacles-meaning-tarot-card-meanings"),

  "twoofcups": new Card("The Two of Cups", "2", Suits.Cups, "",
    ["unity", "partnership", "connection"], ["imbalance", "broken communication", "tension"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/two-of-cups-meaning-tarot-card-meanings"),

  "twoofwands": new Card("The Two of Wands", "2", Suits.Wands, "",
    ["planning", "making decisions", "leaving home"], ["fear of change", "playing safe", "bad planning"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/two-of-wands-meaning-tarot-card-meanings"),

  "twoofswords": new Card("The Two of Swords", "2", Suits.Swords, "",
    ["difficult choices", "indecision", "stalemate"], ["lesser of two evils", "no right choice", "confusion"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/two-of-swords-meaning-tarot-card-meanings"),

  "twoofpentacles": new Card("The Two of Pentacles", "2", Suits.Pentacles, "",
    ["balancing decisions", "priorities", "adapting to change"], ["loss of balance", "disorganized", "overwhelmed"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/two-of-pentacles-meaning-tarot-card-meanings"),

  "threeofcups": new Card("The Three of Cups", "3", Suits.Cups, "",
    ["friendship", "community", "happiness"], ["overindulgence", "gossip", "isolation"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/three-of-cups-meaning-tarot-card-meanings"),

  "threeofwands": new Card("The Three of Wands", "3", Suits.Wands, "",
    ["looking ahead", "expansion", "rapid growth"], ["obstacles", "delays", "frustration"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/three-of-wands-meaning-tarot-card-meanings"),

  "threeofswords": new Card("The Three of Swords", "3", Suits.Swords, "",
    ["heartbreak", "suffering", "grief"], ["recovery", "forgiveness", "moving on"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/three-of-swords-meaning-tarot-card-meanings"),

  "threeofpentacles": new Card("The Three of Pentacles", "3", Suits.Pentacles, "",
    ["teamwork", "collaboration", "building"], ["lack of teamwork", "disorganized", "group conflict"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/three-of-pentacles-meaning-tarot-card-meanings"),

  "fourofcups": new Card("The Four of Cups", "4", Suits.Cups, "",
    ["apathy", "contemplation", "disconnectedness"], ["sudden awareness", "choosing happiness", "acceptance"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/four-of-cups-meaning-tarot-card-meanings"),

  "fourofwands": new Card("The Four of Wands", "4", Suits.Wands, "",
    ["community", "home", "celebration"], ["lack of support", "transience", "home conflicts"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/four-of-wands-meaning-tarot-card-meanings"),

  "fourofswords": new Card("The Four of Swords", "4", Suits.Swords, "",
    ["rest", "restoration", "contemplation"], ["restlessness", "burnout", "stress"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/four-of-swords-meaning-tarot-card-meanings"),

  "fourofpentacles": new Card("The Four of Pentacles", "4", Suits.Pentacles, "",
    ["conservation", "frugality", "security"], ["greediness", "stinginess", "possessiveness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/four-of-pentacles-meaning-tarot-card-meanings"),

  "fiveofcups": new Card("The Five of Cups", "5", Suits.Cups, "",
    ["loss", "grief", "self-pity"], ["acceptance", "moving on", "finding peace"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/five-of-cups-meaning-tarot-card-meanings"),

  "fiveofwands": new Card("The Five of Wands", "5", Suits.Wands, "",
    ["competition", "rivalry", "conflict"], ["avoiding conflict", "respecting differences"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/five-of-wands-meaning-tarot-card-meanings"),

  "fiveofswords": new Card("The Five of Swords", "5", Suits.Swords, "",
    ["unbridled ambition", "win at all costs", "sneakiness"], ["lingering resentment", "desire to reconcile", "forgiveness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/five-of-swords-meaning-tarot-card-meanings"),

  "fiveofpentacles": new Card("The Five of Pentacles", "5", Suits.Pentacles, "",
    ["need", "poverty", "insecurity"], ["recovery", "charity", "improvement"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/five-of-pentacles-meaning-tarot-card-meanings"),

  "sixofcups": new Card("The Six of Cups", "6", Suits.Cups, "",
    ["familiarity", "happy memories", "healing"], ["moving forward", "leaving home", "independence"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/six-of-cups-meaning-tarot-card-meanings"),

  "sixofwands": new Card("The Six of Wands", "6", Suits.Wands, "",
    ["victory", "success", "public reward"], ["excess pride", "lack of recognition", "punishment"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/six-of-wands-meaning-tarot-card-meanings"),

  "sixofswords": new Card("The Six of Swords", "6", Suits.Swords, "",
    ["transition", "leaving behind", "moving on"], ["emotional baggage", "unresolved issues", "resisting transition"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/six-of-swords-meaning-tarot-card-meanings"),

  "sixofpentacles": new Card("The Six of Pentacles", "6", Suits.Pentacles, "",
    ["charity", "generosity", "sharing"], ["strings attached", "stinginess", "power and domination"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/six-of-pentacles-meaning-tarot-card-meanings"),

  "sevenofcups": new Card("The Seven of Cups", "7", Suits.Cups, "",
    ["searching for purpose", "choices", "daydreaming"], ["lack of purpose", "diversion", "confusion"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/seven-of-cups-meaning-tarot-card-meanings"),

  "sevenofwands": new Card("The Seven of Wands", "7", Suits.Wands, "",
    ["perseverance", "defensive", "maintaining control"], ["give up", "destroyed confidence", "overwhelmed"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/seven-of-wands-meaning-tarot-card-meanings"),

  "sevenofswords": new Card("The Seven of Swords", "7", Suits.Swords, "",
    ["deception", "trickery", "tactics and strategy"], ["coming clean", "rethinking approach", "deception"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/seven-of-swords-meaning-tarot-card-meanings"),

  "sevenofpentacles": new Card("The Seven of Pentacles", "7", Suits.Pentacles, "",
    ["hard work", "perseverance", "diligence"], ["work without results", "distractions", "lack of rewards"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/seven-of-pentacles-meaning-tarot-card-meanings"),

  "eightofcups": new Card("The Eight of Cups", "8", Suits.Cups, "",
    ["walking away", "disillusionment", "leaving behind"], ["avoidance", "fear of change", "fear of loss"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/eight-of-cups-meaning-tarot-card-meanings"),

  "eightofwands": new Card("The Eight of Wands", "8", Suits.Wands, "",
    ["rapid action", "movement", "quick decisions"], ["panic", "waiting", "slowdown"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/eight-of-wands-meaning-tarot-card-meanings"),

  "eightofswords": new Card("The Eight of Swords", "8", Suits.Swords, "",
    ["imprisonment", "entrapment", "self-victimization"], ["self acceptance", "new perspective", "freedom"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/eight-of-swords-meaning-tarot-card-meanings"),

  "eightofpentacles": new Card("The Eight of Pentacles", "8", Suits.Pentacles, "",
    ["apprenticeship", "passion", "high standards"], ["lack of passion", "uninspired", "no motivation"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/eight-of-pentacles-meaning-tarot-card-meanings"),

  "nineofcups": new Card("The Nine of Cups", "9", Suits.Cups, "",
    ["satisfaction", "emotional stability", "luxury"], ["lack of inner joy", "smugness", "dissatisfaction"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/nine-of-cups-meaning-tarot-card-meanings"),

  "nineofwands": new Card("The Nine of Wands", "9", Suits.Wands, "",
    ["resilience", "grit", "last stand"], ["exhaustion", "fatigue", "questioning motivations"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/nine-of-wands-meaning-tarot-card-meanings"),

  "nineofswords": new Card("The Nine of Swords", "9", Suits.Swords, "",
    ["anxiety", "hopelessness", "trauma"], ["hope", "reaching out", "despair"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/nine-of-swords-meaning-tarot-card-meanings"),

  "nineofpentacles": new Card("The Nine of Pentacles", "9", Suits.Pentacles, "",
    ["fruits of labor", "rewards", "luxury"], ["reckless spending", "living beyond means", "false success"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/nine-of-pentacles-meaning-tarot-card-meanings"),

  "tenofcups": new Card("The Ten of Cups", "10", Suits.Cups, "",
    ["inner happiness", "fulfillment", "dreams coming true"], ["shattered dreams", "broken family", "domestic disharmony"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/ten-of-cups-meaning-tarot-card-meanings"),

  "tenofwands": new Card("The Ten of Wands", "10", Suits.Wands, "",
    ["accomplishment", "responsibility", "burden"], ["inability to delegate", "overstressed", "burnt out"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/ten-of-wands-meaning-tarot-card-meanings"),

  "tenofswords": new Card("The Ten of Swords", "10", Suits.Swords, "",
    ["failure", "collapse", "defeat"], ["can't get worse", "only upwards", "inevitable end"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/ten-of-swords-meaning-tarot-card-meanings"),

  "tenofpentacles": new Card("The Ten of Pentacles", "10", Suits.Pentacles, "",
    ["legacy", "culmination", "inheritance"], ["fleeting success", "lack of stability", "lack of resources"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/ten-of-pentacles-meaning-tarot-card-meanings"),

  "pageofcups": new Card("The Page of Cups", "Page", Suits.Cups, "",
    ["happy surprise", "dreamer", "sensitivity"], ["emotional immaturity", "insecurity", "disappointment"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/page-of-cups-meaning-tarot-card-meanings"),

  "pageofwands": new Card("The Page of Wands", "Page", Suits.Wands, "",
    ["exploration", "excitement", "freedom"], ["lack of direction", "procrastination", "creating conflict"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/page-of-wands-meaning-tarot-card-meanings"),

  "pageofswords": new Card("The Page of Swords", "Page", Suits.Swords, "",
    ["curiosity", "restlessness", "mental energy"], ["deception", "manipulation", "all talk"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/page-of-swords-meaning-tarot-card-meanings"),

  "pageofpentacles": new Card("The Page of Pentacles", "Page", Suits.Pentacles, "",
    ["ambition", "desire", "diligence"], ["lack of commitment", "greediness", "laziness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/page-of-pentacles-meaning-tarot-card-meanings"),

  "knightofcups": new Card("The Knight of Cups", "Knight", Suits.Cups, "",
    ["following the heart", "idealist", "romantic"], ["moodiness", "disappointment"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/knight-of-cups-meaning-tarot-card-meanings"),

  "knightofwands": new Card("The Knight of Wands", "Knight", Suits.Wands, "",
    ["action", "adventure", "fearlessness"], ["anger", "impulsiveness", "recklessness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/knight-of-wands-meaning-tarot-card-meanings"),

  "knightofswords": new Card("The Knight of Swords", "Knight", Suits.Swords, "",
    ["action", "impulsiveness", "defending beliefs"], ["no direction", "disregard for consequences", "unpredictability"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/knight-of-swords-meaning-tarot-card-meanings"),

  "knightofpentacles": new Card("The Knight of Pentacles", "Knight", Suits.Pentacles, "",
    ["efficiency", "hard work", "responsibility"], ["laziness", "obsessiveness", "work without reward"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/knight-of-pentacles-meaning-tarot-card-meanings"),

  "queenofcups": new Card("The Queen of Cups", "Queen", Suits.Cups, "",
    ["compassion", "calm", "comfort"], ["martyrdom", "insecurity", "dependence"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/queen-of-cups-meaning-tarot-card-meanings"),

  "queenofwands": new Card("The Queen of Wands", "Queen", Suits.Wands, "",
    ["courage", "determination", "joy"], ["selfishness", "jealousy", "insecurities"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/queen-of-wands-meaning-tarot-card-meanings"),

  "queenofswords": new Card("The Queen of Swords", "Queen", Suits.Swords, "",
    ["complexity", "perceptiveness", "clear mindedness"], ["cold hearted", "cruel", "bitterness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/queen-of-swords-meaning-tarot-card-meanings"),

  "queenofpentacles": new Card("The Queen of Pentacles", "Queen", Suits.Pentacles, "",
    ["practicality", "creature comforts", "financial security"], ["self-centeredness", "jealousy", "smothering"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/queen-of-pentacles-meaning-tarot-card-meanings"),

  "kingofcups": new Card("The King of Cups", "King", Suits.Cups, "",
    ["compassion", "control", "balance"], ["coldness", "moodiness", "bad advice"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/king-of-cups-meaning-tarot-card-meanings"),

  "kingofwands": new Card("The King of Wands", "King", Suits.Wands, "",
    ["big picture", "leader", "overcoming challenges"], ["impulsive", "overbearing", "unachievable expectations"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/king-of-wands-meaning-tarot-card-meanings"),

  "kingofswords": new Card("The King of Swords", "King", Suits.Swords, "",
    ["head over heart", "discipline", "truth"], ["manipulative", "cruel", "weakness"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/king-of-swords-meaning-tarot-card-meanings"),

  "kingofpentacles": new Card("The King of Pentacles", "King", Suits.Pentacles, "",
    ["abundance", "prosperity", "security"], ["greed", "indulgence", "sensuality"],
    "https://labyrinthos.co/blogs/tarot-card-meanings-list/king-of-pentacles-meaning-tarot-card-meanings")
};

const allSuitDescriptions = {
  "wands": ":stick::fire::sunrise: Associated with the element of *fire*, the suit of wands represents *passion, inspiration and willpower*. The wands imbue their users with primal energy, for it is through them that the cycle of creation can begin. Because of their ability to bring energy into any situation, they are also associated with action, ambition and making plans. At their worst, they can refer to situations that are filled with recklessness and lack of direction. As you follow the journey within the wands, you'll come across these themes again and again.",
  "cups": ":wine_glass::ocean::sweat_drops: The suit of cups rules over all that is associated with *emotions, the unconscious, creativity, and intuition*. They frequently talk about relationships, whether romantic or otherwise, and one's imagination and inner world. They are associated with the element of *water*, which becomes a frequent visual theme within this suit. At their worst, the cups suit is fret with uncontrolled feelings, fantasy, and a disconnect with one's inner voice.",
  "swords": ":dagger_knife::wind_blowing_face::tornado: The swords is the suit of *intelligence, logic, truth, ambition, conflict and communication*. It is associated with the element of *air*. In readings, these cards focus on the faculty and power of intellect, which like the swords themselves, are double-edged. This can be used for both good or evil, to help and to harm, and our greatest conflicts usually come from this delicate balance. At their worst, the swords can be abusive, harsh, and lack empathy.",
  "pentacles": ":coin::mountain::ore_catan: The pentacles is the suit of all things worldly and material. Though we will immediately think of the pentacles as relating to financial matters, we also can understand them as being associated with *security, stability, nature, health, and prosperity*. The pentacles are of *earth* element. When we see pentacles show up in a reading, they are usually concerned with your long term future, career, generosity, your household, business investments and your feelings of sensuality. The negative side of the pentacles show up as greed, jealousy, miserliness, and unbridled ambition at the cost of all else.",
  "majors": ":star: The Major Arcana is a 22 card set within the tarot that is considered to be the core and the foundation for the deck. All of the deck is filled with archetypal significance, but this is most pronounced within the Major Arcana. These cards follow a storyline that tells of the spiritual travels taken from the innocent wonder of The Fool to the oneness and fulfillment of The World. In other words, these cards *tell the story of humanity's spiritual evolution into enlightenment and individuation*. And so, as we follow the journey of the Fool, we can start seeing common parallels between our own stages in life and those in the cards, each card teaching a specific lesson and a concept to meditate over. Because they form the basis of the tarot, some readings can sometimes be conducted with only the Major Arcana as well."
};

const allRankDescriptions = {
  "aces": ":atrain::ctrain::etrain: Aces!",
  "twos": ":two: Twos!",
  "threes": ":three: Threes!",
  "fours": ":four: Fours!",
  "fives": ":five: Fives!",
  "sixes": ":six: Sixes!",
  "sevens": ":seven: Sevens!",
  "eights": ":eight: Eights!",
  "nines": ":nine: Nines!",
  "tens": ":keycap_ten: Tens!",
  "pages": ":morty: Pages!",
  "knights": ":horse_racing: Knights!",
  "queens": ":princess: Queens!",
  "kings": ":prince: Kings!"
};


module.exports = {
  "allCards": allCards,
  "Card": Card,
  "Suits": Suits,
  "allSuitDescriptions": allSuitDescriptions,
  "allRankDescriptions": allRankDescriptions
};