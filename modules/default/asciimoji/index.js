'use strict';



const emoji_dictionary = {
    a: "\n\
  ..#..\n\
  .###.\n\
  ##.##\n\
  #...#\n\
  #####\n\
  #...#\n\
  #...#",


   b: "\n\
  #####.\n\
  ##..##\n\
  ##..##\n\
  #####.\n\
  ##..##\n\
  ##..##\n\
  #####.",


   c: "\n\
  ..##.\n\
  ##.##\n\
  ##...\n\
  ##...\n\
  ##...\n\
  ##.##\n\
  ..##.",


   d: "\n\
  ####..\n\
  ##..#.\n\
  ##..##\n\
  ##..##\n\
  ##..##\n\
  ##..#.\n\
  ####..",


   e: "\n\
  #####\n\
  ##...\n\
  ##...\n\
  ###..\n\
  ##...\n\
  ##...\n\
  #####",


   f: "\n\
  #####\n\
  #####\n\
  ##...\n\
  ####.\n\
  ####.\n\
  ##...\n\
  ##...",


   g: "\n\
  .####..\n\
  ##..##.\n\
  ##.....\n\
  ##.####\n\
  ##..##.\n\
  ##..##.\n\
  .####..",

   h: "\n\
  ##..##\n\
  ##..##\n\
  ##..##\n\
  ######\n\
  ##..##\n\
  ##..##\n\
  ##..##",


   i: "\n\
  ####\n\
  .##.\n\
  .##.\n\
  .##.\n\
  .##.\n\
  .##.\n\
  ####",


   j: "\n\
  ....##\n\
  ....##\n\
  ....##\n\
  ....##\n\
  ##..##\n\
  ##..##\n\
  .####.",


   k: "\n\
  ##...##\n\
  ##..##.\n\
  ##.##..\n\
  ####...\n\
  ##.##..\n\
  ##..##.\n\
  ##...##",


   l: "\n\
  ##..\n\
  ##..\n\
  ##..\n\
  ##..\n\
  ##..\n\
  ####\n\
  ####",


   m: "\n\
  ##....##\n\
  ###..###\n\
  ########\n\
  ##.##.##\n\
  ##....##\n\
  ##....##\n\
  ##....##",


   n: "\n\
  ##..##\n\
  ##..##\n\
  ###.##\n\
  ######\n\
  ##.###\n\
  ##.###\n\
  ##..##",


   o: "\n\
  ..##..\n\
  .####.\n\
  ##..##\n\
  ##..##\n\
  ##..##\n\
  .####.\n\
  ..##..",


   p: "\n\
  #####.\n\
  ##..##\n\
  ##..##\n\
  #####.\n\
  ##....\n\
  ##....\n\
  ##....",


   q: "\n\
  ...###...\n\
  .##...##.\n\
  ##.....##\n\
  ##.....##\n\
  ##..##.##\n\
  ##....##.\n\
  ..####.##",


   r: "\n\
  ######.\n\
  ##...##\n\
  ##...#.\n\
  ####...\n\
  ##.##..\n\
  ##..##.\n\
  ##...##",


   s: "\n\
  .####.\n\
  ##..##\n\
  ##....\n\
  .####.\n\
  ....##\n\
  ##..##\n\
  .####.",


   t: "\n\
  ######\n\
  ######\n\
  ..##..\n\
  ..##..\n\
  ..##..\n\
  ..##..\n\
  ..##..",


   u: "\n\
  ##..##\n\
  ##..##\n\
  ##..##\n\
  ##..##\n\
  ##..##\n\
  ##..##\n\
  .####.",


   v: "\n\
  ##....##\n\
  ##....##\n\
  ##....##\n\
  ##....##\n\
  .##..##.\n\
  ..####..\n\
  ...##...",


   w: "\n\
  ##....##\n\
  ##.##.##\n\
  ##.##.##\n\
  ##.##.##\n\
  ##.##.##\n\
  ##.##.##\n\
  .##..##.",


   x: "\n\
  ##.....##\n\
  .##...##.\n\
  ..##.##..\n\
  ...###...\n\
  ..##.##..\n\
  .##...##.\n\
  ##.....##",


   y: "\n\
  ##....##\n\
  .##..##.\n\
  ..####..\n\
  ...##...\n\
  ...##...\n\
  ...##...\n\
  ...##...",


   z: "\n\
  ########\n\
  .....##.\n\
  ....##..\n\
  ...##...\n\
  ..##....\n\
  .##.....\n\
  ########",


   1: "\n\
  .##.\n\
  ###.\n\
  .##.\n\
  .##.\n\
  .##.\n\
  .##.\n\
  ####",


   2: "\n\
  .###.\n\
  ##.##\n\
  ...##\n\
  .###.\n\
  ##...\n\
  ##...\n\
  #####",


   3: "\n\
  .###.\n\
  ##.##\n\
  ...##\n\
  .###.\n\
  ...##\n\
  ##.##\n\
  .###.",


   4: "\n\
  ##....\n\
  ##.##.\n\
  ##.##.\n\
  ##.##.\n\
  ######\n\
  ...##.\n\
  ...##.",



   5: "\n\
  #####\n\
  ##...\n\
  ##...\n\
  ####.\n\
  ...##\n\
  ##.##\n\
  .###.",


   6: "\n\
  .###.\n\
  ##.##\n\
  ##...\n\
  ####.\n\
  ##.##\n\
  ##.##\n\
  .###.",


   7: "\n\
  ######\n\
  #....#\n\
  ....#..\n\
  ...#...\n\
  ..#....\n\
  ..#....\n\
  ..#....",


   8: "\n\
  .###.\n\
  ##.##\n\
  ##.##\n\
  .###.\n\
  ##.##\n\
  ##.##\n\
  .###.",


   9: "\n\
  .###.\n\
  ##.##\n\
  ##.##\n\
  .####\n\
  ...##\n\
  ##.##\n\
  .###.",


   0: "\n\
  ..###..\n\
  .##.##.\n\
  ##...##\n\
  ##...##\n\
  ##...##\n\
  .##.##.\n\
  ..###..",


   space: "\n\
  .\n\
  .\n\
  .\n\
  .\n\
  .\n\
  .\n\
  ."
};

module.exports = class Asciimoji extends BaseModule {
  
  async handle(data) {
    const argsSplit = data.user_text.split(" ");
    const emoji_one = argsSplit[0];
    const emoji_two = argsSplit[1];
    if (!emoji_one.includes(":") || !emoji_one.includes(":")) {
      this.bot.postMessage(data.channel, this.help());
      return;
    }

    const text = argsSplit.splice(2, argsSplit.length).join(" ").toLowerCase();

    if (!emoji_one || !emoji_two || !text) {
      this.bot.postMessage(data.channel, this.help());
      return;
    }

    const letterArray = text.split("");
    const messageArray = [];
    while (letterArray.length > 0) {
      let chunk = letterArray.splice(0, 5);
      let line = "";
      chunk.map(letter => {
        let msg = this.getLetter(letter);
        line = this.addToLine(line, msg);                
      });

      line = line.replaceAll("#", emoji_one);
      line = line.replaceAll(".", emoji_two);        
      messageArray.push(line);        
    }
    
    this.bot.postMessageSequentially(data, messageArray);
  }



  getLetter(letter) {
    if (letter === " ") {
      letter = "space";
    }

    let tile = emoji_dictionary[letter];
    return tile;
  }

  addToLine(line, letter) {
    if (!line) {      
      return letter;
    }

    const lineArray = line.split("\n");    
    const letterArray = letter.split("\n");
    for (let i = 0; i < letterArray.length; i++) {
      if (!lineArray[i] || !letterArray[i]) {
        lineArray[i] = lineArray[i].trim() + letterArray[i].trim() + "\n";
        continue;
      }

      lineArray[i] = lineArray[i].trim() + "." + letterArray[i].trim() + "\n";
    }

    return lineArray.join("");
  }

  help() {
    return 'Usage: `<emoji_one> <emoji_two> text`';
  }  
};


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
