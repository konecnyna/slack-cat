class Node {
  constructor(values, children, parent) {
    this.values = values;
    this.children = children;
    this.parent = parent;
  }

  isRoot() {
    return this.parent === null;
  }
}

function walkTree(node, key, depth, callback) {
  callback(node, key, depth);
  Object.keys(node.children).forEach(function (childKey) {
    walkTree(node.children[childKey], childKey, depth + 1);
  });
}

function printNodeTree(root) {
  walkTree(root, "(ROOT)", 0, function (node, nodeKey, depth) {
    const spacer = "--".repeat(depth) + ">";
    console.log(spacer + " " + key + ", Values: " + node.values);
  });
}

function theWorksString() {
  let outString = "";
  Object.keys(rawLetterEmojiTable).forEach(function (key) {
    outString += "Key: `" + key + "`, emojis: " + rawLetterEmojiTable[key] + "\n";
  });
  return outString;
}

function getBottomMostNode(root, key) {

  let currentNode = root;
  for (let keyIdx = 0; keyIdx < key.length; keyIdx++) {
    let currentKeyPiece = key.charAt(keyIdx);
    let nextNode = currentNode.children[currentKeyPiece];
    if (nextNode === undefined) {
      nextNode = new Node(null, {}, currentNode, false);
      currentNode.children[currentKeyPiece] = nextNode;
    }
    currentNode = nextNode;
  }
  return currentNode;
}

const rawLetterEmojiTable = {
  "a": [":atrain:", ":a:"],
  "b": [":btrain:", ":app-man:", ":bitcoin:", ":b:"],
  "c": [":ctrain:", ":copyright:"],
  "d": [":dtrain:"],
  "e": [":etrain:", ":ie:", ":emacs:"],
  "f": [":ftrain:"],
  "g": [":gtrain:", ":grammar-nazi:", ":gryffindor:"],
  "h": [":hufflepuff:"],
  "i": [":information_source:"],
  "j": [":jtrain:"],
  "k": [":k:", ":potassium:"],
  "l": [":ltrain:", ":ltc:"],
  "m": [":mtrain:", ":part_alternation_mark:", ":m:"],
  "n": [":ntrain:"],
  "o": [":O:", ":o2:", ":donut-simpsons:"],
  "p": [":parking:"],
  "q": [":qtrain:"],
  "r": [":rtrain:", ":registered:", ":ravenclaw:"],
  "s": [":stash:", ":strek:", ":sophos:", ":wisdomb:", ":stach:"],
  "t": [":ttrain:", ":shrek-tpose:", ":jimmy-tpose:", ":waluigi-tpose:", ":t:"],
  "u": [":ophiuchus:"],
  "v": [":vine:", ":vim:"],
  "w": [":wtrain:", ":wordpress:", ":wutang:"],
  "x": [":x:", ":heavy_multiplication_x:", ":negative_squared_cross_mark:"],
  "z": [":ztrain:", ":teamzissous:"],

  "1": [":one:", ":1train:"],
  "2": [":two:", ":2train:"],
  "3": [":three:", ":3train:"],
  "4": [":four:", ":4train:"],
  "5": [":five:", ":5train:", ":html:"],
  "6": [":six:", ":6train:"],
  "7": [":seven:", ":7train:"],
  "8": [":eight:"],
  "9": [":nine:"],
  "10": [":keycap_ten:"],
  "100": [":100:"],
  "0": [":000:", ":zero:"],

  "?": [":question:", ":grey_question:", ":uup:", ":question_block:"],
  "!": [":warning:", ":exclamation:", ":grey_exclamation:"],
  "!!": [":bangbang:"],
  "!?": [":interrobang:"],
  "$": [":coin:"],
  "+": [":heavy_plus_sign:"],

  "ab": [":ab:"],
  "abc": [":abc:"],
  "atm": [":atm:"],
  "back": [":back:"],
  "brb": [":brb-sign:"],
  "cl": [":cl:"],
  "cta": [":cta:"],
  "deep": [":deep:"],
  "dope": [":dope:", ":dope-txt:", ":dope_marquee:"],
  "end": [":end:"],
  "id": [":id:"],
  "idk": [":idk:"],
  "js": [":js:"],
  "la": [":la:"],
  "lb": [":lb:"],
  "mood": [":mood:"],
  "mta": [":mta:"],
  "nay": [":nay:"],
  "new": [":new:"],
  "nice": [":nice:"],
  "ng": [":ng:"],
  "ny": [":giants:"],
  "ok": [":ok:"],
  "on": [":on:"],
  "oof": [":oof:"],
  "rip": [":grave:"],
  "soon": [":soon:"],
  "sos": [":sos:"],
  "tm": [":tm:"],
  "top": [":top:"],
  "up": [":up:"],
  "ups": [":ups:"],
  "vs": [":vs:"],
  "wc": [":wc:"],
  "we": [":wework:"],
  "win": [":win:"],
  "woke": [":woke:"],
  "yay": [":yay:"]
};

const letterEmojiTree = function buildEmojiTable(letterEmojiTable) {
  let rootNode = new Node(null, {}, null);
  Object.keys(letterEmojiTable).forEach(function (tableKey) {
    const valuesForKey = letterEmojiTable[tableKey];
    let bottomMostNode = getBottomMostNode(rootNode, tableKey);
    bottomMostNode.values = valuesForKey;
  });
  return rootNode;
}(rawLetterEmojiTable);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomEmojiFrom(list) {
  return list[getRandomInt(list.length)];
}

function validateLetterEmojiTree(tree) {
  printNodeTree(tree, "(ROOT)", 0);
}

module.exports = class EmojiFont {

  constructor() {
    // pass
  }

  giveEmTheWorks() {
    return theWorksString();
  }

  emojify(userInput) {
    userInput = userInput.trim().toLowerCase();
    let outString = "";
    let idx = 0;

    let currentNode = letterEmojiTree;
    let isBacktracking = false;
    while (idx < userInput.length || !currentNode.isRoot()) {
      let currentLetter = "?????"
      // if we're at the end of the string, don't try and collect more nodes, just let the last node on the stack resolve
      if (idx < userInput.length) {
        currentLetter = userInput.charAt(idx);
        // there's a compound glyph to be found starting with this letter. if we're backing up, we know following it will lead to dead end
        if (currentNode.children[currentLetter] !== undefined && isBacktracking === false) {
          currentNode = currentNode.children[currentLetter];
          idx += 1;
          continue;
        }
      }

      // we're at a terminal node

      // there are values for this terminal, capture one and reset the tree, don't backtrack idx to get current letter which failed the glyph compose above to run on its own
      if (currentNode.values !== null) {
        outString += randomEmojiFrom(currentNode.values);
        currentNode = letterEmojiTree;
        isBacktracking = false;
        continue;
      }

      // there is nothing in the tree at all about this, just put it in as is
      if (currentNode.isRoot()) {
        outString += currentLetter;
        idx += 1;
        currentNode = letterEmojiTree;
        isBacktracking = false;
        continue;
      }

      // we dug into a compound glyph but didn't complete it, lets backtrack
      if (currentNode.values === null) {
        idx -= 1;
        isBacktracking = true;
        currentNode = currentNode.parent;
      }
    }

    return outString;
  }
}
