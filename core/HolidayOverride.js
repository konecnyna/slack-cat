const makeRange = (startDay, numberOfDays) => {
  return Array.from(new Array(numberOfDays), (x, i) => i + startDay)
}

const overrides = [
  {
    month: 4,
    days: [2, 3, 4],
    botParams: {
      username: 'AmericaCat',
      icon_emoji: ':flag-us:',
      icon_url: ''
    }
  },
  {
    month: 10,
    days: makeRange(1, 31),
    botParams: {
      username: 'SpookyCat',
      icon_emoji: ':jack_o_lantern:',
      icon_url: ''
    }
  },
  {
    month: 12,
    days: makeRange(23, 28),
    botParams: {
      username: 'TurkeyCat',
      icon_emoji: ':turkey:',
      icon_url: ''
    }
  },
  {
    month: 12,
    days: makeRange(1, 25),
    botParams: {
      username: 'HolidayCat',
      icon_emoji: ':christmas_tree:',
      icon_url: ''
    }
  }
]

module.exports = class HolidayOverride {
  getOverride() {
    const override = overrides.filter(it => {
      return this.validateDate(it.month, it.days)
    })

    if (!override || !override.length) {
      return false
    }

    return override[0].botParams
  }

  validateDate(month, days) {
    const now = new Date()
    return days.includes(now.getDate()) && now.getMonth() == month - 1
  }
}
