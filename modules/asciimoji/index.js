`use strict`;

const emoji_dictionary = {
  a: `
  ..#..
  .###.
  ##.##
  #...#
  #####
  #...#
  #...#`,

  b:
    `
  #####.
  ##..##
  ##..##
  #####.
  ##..##
  ##..##
  #####.`,

  c: `
  ..##.
  ##.##
  ##...
  ##...
  ##...
  ##.##
  ..##.`,

  d:
    `
  ####..
  ##..#.
  ##..##
  ##..##
  ##..##
  ##..#.
  ####..`,

  e: `
  #####
  ##...
  ##...
  ###..
  ##...
  ##...
  #####`,

  f: `
  #####
  #####
  ##...
  ####.
  ####.
  ##...
  ##...`,

  g:
    `
  .####..
  ##..##.
  ##.....
  ##.####
  ##..##.
  ##..##.
  .####..`,

  h:
    `
  ##..##
  ##..##
  ##..##
  ######
  ##..##
  ##..##
  ##..##`,

  i: `
  ####
  .##.
  .##.
  .##.
  .##.
  .##.
  ####`,

  j:
    `
  ....##
  ....##
  ....##
  ....##
  ##..##
  ##..##
  .####.`,

  k:
    `
  ##...##
  ##..##.
  ##.##..
  ####...
  ##.##..
  ##..##.
  ##...##`,

  l: `
  ##..
  ##..
  ##..
  ##..
  ##..
  ####
  ####`,

  m:
    `
  ##....##
  ###..###
  ########
  ##.##.##
  ##....##
  ##....##
  ##....##`,

  n:
    `
  ##..##
  ##..##
  ###.##
  ######
  ##.###
  ##.###
  ##..##`,

  o:
    `
  ..##..
  .####.
  ##..##
  ##..##
  ##..##
  .####.
  ..##..`,

  p:
    `
  #####.
  ##..##
  ##..##
  #####.
  ##....
  ##....
  ##....`,

  q:
    `
  ...###...
  .##...##.
  ##.....##
  ##.....##
  ##..##.##
  ##....##.
  ..####.##`,

  r:
    `
  ######.
  ##...##
  ##...#.
  ####...
  ##.##..
  ##..##.
  ##...##`,

  s:
    `
  .####.
  ##..##
  ##....
  .####.
  ....##
  ##..##
  .####.`,

  t:
    `
  ######
  ######
  ..##..
  ..##..
  ..##..
  ..##..
  ..##..`,

  u:
    `
  ##..##
  ##..##
  ##..##
  ##..##
  ##..##
  ##..##
  .####.`,

  v:
    `
  ##....##
  ##....##
  ##....##
  ##....##
  .##..##.
  ..####..
  ...##...`,

  w:
    `
  ##....##
  ##.##.##
  ##.##.##
  ##.##.##
  ##.##.##
  ##.##.##
  .##..##.`,

  x:
    `
  ##.....##
  .##...##.
  ..##.##..
  ...###...
  ..##.##..
  .##...##.
  ##.....##`,

  y:
    `
  ##....##
  .##..##.
  ..####..
  ...##...
  ...##...
  ...##...
  ...##...`,

  z:
    `
  ########
  .....##.
  ....##..
  ...##...
  ..##....
  .##.....
  ########`,

  1: `
  .##.
  ###.
  .##.
  .##.
  .##.
  .##.
  ####`,

  2: `
  .###.
  ##.##
  ...##
  .###.
  ##...
  ##...
  #####`,

  3: `
  .###.
  ##.##
  ...##
  .###.
  ...##
  ##.##
  .###.`,

  4: `
  ##....
  ##.##.
  ##.##.
  ##.##.
  ######
  ...##.
  ...##.`,

  5: `
  #####
  ##...
  ##...
  ####.
  ...##
  ##.##
  .###.`,

  6: `
  .###.
  ##.##
  ##...
  ####.
  ##.##
  ##.##
  .###.`,

  7: `
  ######
  #....#
  ....#..
  ...#...
  ..#....
  ..#....
  ..#....`,

  8: `
  .###.
  ##.##
  ##.##
  .###.
  ##.##
  ##.##
  .###.`,

  9: `
  .###.
  ##.##
  ##.##
  .####
  ...##
  ##.##
  .###.`,

  0: `
  ..###..
  .##.##.
  ##...##
  ##...##
  ##...##
  .##.##.
  ..###..`,

  space: `
  .
  .
  .
  .
  .
  .
  .`,
};

module.exports = class Asciimoji extends BaseModule {
  async handle(data) {
    const input = this.getInput(data.user_text);
    if (!input) {
      this.bot.postMessage(data.channel, this.help());
      return;
    }
    const messageArray = [];
    while (input.letterArray.length > 0) {
      let chunk = input.letterArray.splice(0, 5);
      let line = '';
      chunk.map(letter => {
        let msg = this.getLetter(letter);
        line = this.addToLine(line, msg);
      });

      line = line.replaceAll('#', input.emoji_one);
      line = line.replaceAll('.', input.emoji_two);
      messageArray.push(line);
    }

    for (let i = 0; i < messageArray.length; i++) {
      await this.bot.postMessage(data.channel, messageArray[i]);
    }
  }

  getInput(userText) {
    const emojiRegex = /(:[^\s]+:)/g;
    let match = emojiRegex.exec(userText);
    const emojis = [];
    while (match != null) {
      emojis.push(match[1]);
      match = emojiRegex.exec(userText);
    }

    if (!emojis.length || emojis.length != 2) {
      return null;
    }

    userText = userText.replaceAll(emojis[0], '');
    userText = userText.replaceAll(emojis[1], '');
    const letterArray = userText.trim().toLowerCase().split('');
    this.padMessage(letterArray)
    return {
      emoji_one: emojis[0],
      emoji_two: emojis[1],
      letterArray: letterArray
    }
  }

  padMessage(letterArray) {
    letterArray.unshift(" ")
    letterArray.push(" ")
  }

  getLetter(letter) {
    if (letter === ' ') {
      letter = 'space';
    }

    let tile = emoji_dictionary[letter];
    return tile;
  }

  addToLine(line, letter) {
    if (!line) {
      return letter;
    }

    const lineArray = line.split('\n');
    const letterArray = letter.split('\n');
    for (let i = 0; i < letterArray.length; i++) {
      if (!lineArray[i] || !letterArray[i]) {
        lineArray[i] = lineArray[i].trim() + letterArray[i].trim() + '\n';
        continue;
      }

      lineArray[i] = lineArray[i].trim() + `.` + letterArray[i].trim() + '\n';
    }

    return lineArray.join('');
  }


  aliases() {
    return [`text`, `ascii`];
  }

  help() {
    return `Usage: < emoji_one > <emoji_two> text`;
  }
};

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};
