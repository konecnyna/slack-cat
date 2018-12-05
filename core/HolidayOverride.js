module.exports = class HolidayOverride {
  getOverride() {
    if (this.validateDate(7, [3, 4])) {
      return this.fourthOfJulyOverride();
    } else if (this.validateDate(10, [27, 28, 29, 30, 31])) {
      return this.halloweenOverride();
    } else if (this.validateDate(12, this.getRange(5, 21))) {
      console.log("xmas");
      return this.christmasOverride();
    }

    return false;
  }

  getRange(startDay, numberOfDays) {
    Array.from(new Array(numberOfDays), (x,i) => i + startDay)
  }

  validateDate(month, days) {
    const now = new Date();
    return days.includes(now.getDate()) && now.getMonth() == month - 1;
  }

  halloweenOverride() {
    return {
      username: 'SpookyCat',
      icon_emoji: ':jack_o_lantern:',
      icon_url: '',
    };
  }

  fourthOfJulyOverride() {
    return {
      username: 'AmericaCat',
      icon_emoji: ':flag-us:',
      icon_url: '',
    };
  }

  christmasOverride() {
    return {
      username: 'HolidayCat',
      icon_emoji: ':christmas_tree:',
      icon_url: '',
    };
  }
};
