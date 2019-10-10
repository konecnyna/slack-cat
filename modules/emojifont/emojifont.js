'use strict';

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

// stuff to provide to every emoji font
const lookupTableDefaults = {
  " ": ["  "] // double wide spaces
};

// stuff to force on to every emoji font;
const lookupTableOverrides = {
  "": undefined // avoid recurse to death scenario, undefine empty string
};

function theWorksString(lookupTable) {
  let outString = "*The Works*:\n";
  Object.keys(lookupTable).forEach(function (key) {
    outString += "Key: `" + key + "`, emojis: " + lookupTable[key] + "\n";
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

function buildEmojiTree(letterEmojiTable) {
  let rootNode = new Node(null, {}, null);
  Object.keys(letterEmojiTable).forEach(function (tableKey) {
    const valuesForKey = letterEmojiTable[tableKey];
    let bottomMostNode = getBottomMostNode(rootNode, tableKey);
    bottomMostNode.values = valuesForKey;
  });
  return rootNode;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomEmojiFrom(list) {
  return list[getRandomInt(list.length)];
}

module.exports = class EmojiFont {

  constructor(sheetCells) {
    let lookupTable = {};
    let gylphOptionMap = {};
    let toRepeatList = [];

    const processCell = (cell) => {
      if (cell.value === "" || cell.value === null) {
        return;
      }

      if (cell.y <= 1) {
        // header cell, pass
        return;
      }
      if (cell.x === 1 && lookupTable[cell.value] === undefined) {
        // gylph cell, add to list
        lookupTable[cell.value] = [];
        gylphOptionMap[cell.y] = cell.value;
      } else {
        // its an option for a glyph
        let gylphName = gylphOptionMap[cell.y];
        if (gylphName === undefined) {
          toRepeatList.push(cell);
        }

        lookupTable[gylphName].push(cell.value);
      }
    };
    sheetCells.forEach(processCell);
    toRepeatList.forEach(processCell); // if input is sorted this is redundant

    lookupTable = {...lookupTableDefaults, ...lookupTable, ...lookupTableOverrides };

    this.letterEmojiTree = buildEmojiTree(lookupTable);
    this.lookupTable = lookupTable;
  }

  giveEmTheWorks() {
    return theWorksString(this.lookupTable);
  }

  emojify(userInput) {
    userInput = userInput.trim().toLowerCase();
    let outString = "";
    let idx = 0;

    let currentNode = this.letterEmojiTree;
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
        currentNode = this.letterEmojiTree;
        isBacktracking = false;
        continue;
      }

      // there is nothing in the tree at all about this, just put it in as is
      if (currentNode.isRoot()) {
        outString += currentLetter;
        idx += 1;
        currentNode = this.letterEmojiTree;
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
