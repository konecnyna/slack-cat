
class CardSpread {
  constructor(name, allowsInversion, shape, items) {
    this.name = name;
    this.allowsInversion = allowsInversion;
    this.shape = shape.replace(/^\n|\n$/g, ''); // trim leading and trailing newline
    this.items = items;

    let longestItem = 0;
    Object.keys(items).forEach(function (itemKey) {
      const item = items[itemKey];
      longestItem = Math.max(item.length, longestItem);
    });
    this.longestItem = longestItem;
    this.numberOfCards = Object.keys(items).length;
  }
}
const MaxSpreadItemDescLength = 50;

const CrossSpread = new CardSpread("Cross", true,
  `
 d
aeb
 c
`,
  {
    a: "Inner self",
    b: "Outer self",
    c: "Diminishing Influence",
    d: "Rising Influence",
    e: "True self"
  });

const TimeSpread = new CardSpread("Time", true,
  `
abc
`,
  {
    a: "Past",
    b: "Present",
    c: "Future"
  });

const CrowleySpread = new CardSpread("Crowley", false,
  `
mie dhl
  bac
njf gko
`,
  {
    a: "Querent",
    b: "Main Influence",
    c: "Main Influence",
    d: "Future",
    h: "Future",
    l: "Future",
    m: "Alternative Future",
    i: "Alternative Future",
    e: "Alternative Future",
    n: "Lesson, Process",
    j: "Lesson, Process",
    f: "Lesson, Process",
    g: "External Forces",
    k: "External Forces",
    o: "External Forces"
  });

const TemperanceSpread = new CardSpread("Temperance", false,
  `
abcd
`,
  {
    a: "Invitation",
    b: "Feeling",
    c: "Action",
    d: "Release"
  });

const CelticCrossSpread = new CardSpread("Celtic Cross", false,
  `
  e_  _j
      i
f_ab_c
      h
  d_  _g
`,
  {
    a: "Present",
    b: "Immediate Challenge",
    c: "Distant Past",
    d: "Recent Past",
    e: "Best Outcome",
    f: "Immediate Future",
    g: "Factors",
    h: "External Influences",
    i: "Hopes and Fears",
    j: "Final Outcome"
  });


const allSpreads = {
  "cross": CrossSpread,
  "time": TimeSpread,
  "crowley": CrowleySpread,
  "charlyn": TemperanceSpread,
  "celtic": CelticCrossSpread
};

function uniqueKeysInSpread(spreadString) {
  let foundItems = {};
  for (let shapeIdx = 0; shapeIdx < spreadString.length; shapeIdx++) {
    const char = spreadString.charAt(shapeIdx);
    if (char === " " || char === "\n" || char === "_") {
      continue;
    }
    if (foundItems[char] !== undefined) {
      return;
    }
    foundItems[char] = true;
  }
  return foundItems;
}

function objectsHaveSameKeys(...objects) {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every(object => union.size === Object.keys(object).length);
}

function validateSpreads() {
  const allSpreadKeys = Object.keys(allSpreads);

  allSpreadKeys.forEach(function (spreadKey) {
    const spread = allSpreads[spreadKey];

    if (spread.name === undefined) {
      console.log("Spread " + spreadKey + " is missing a name");
      spread.name = "Unknown";
    }

    if (spread.shape === undefined) {
      console.log("Spread " + spreadKey + " is missing a shape");
      spread.shape = "";
    }

    if (spread.shape.startsWith("\n") || spread.shape.endsWith("\n")) {
      console.log("Spread " + spreadKey + " failed to trim newlines");
    }

    let keysInSpread = uniqueKeysInSpread(spread.shape);
    if (keysInSpread === undefined) {
      console.log("Spread " + spreadKey + " has duplicated cards, each card in the spread shape must be unique");
      keysInSpread = {};
    } else {
      if (!objectsHaveSameKeys(keysInSpread, spread.items)) {
        console.log("Spread " + spreadKey + " has mismatched keys in the spread shape and meanings list");
        console.log("  [SHAPE]: " + Object.keys(keysInSpread));
        console.log("  [SHAPE]: " + Object.keys(spread.items));
      }
    }

    if (spread.longestItem > MaxSpreadItemDescLength) {
      console.log("Spread " + spreadKey + " has an item description that is too long, please keep it under " + MaxSpreadItemDescLength);
    }
  });
}

module.exports = class TarotCardSpreads {

  constructor() {
    validateSpreads();
  }

  spreadNamed(name) {
    return allSpreads[name];
  }

  allSpreadNames() {
    return Object.keys(allSpreads);
  }
}