'use strict';

const radars = [
  {
    "value": "usa",
    "text": "United States"
  },
  {
    "value": "bfl",
    "text": "CA - Bakersfield"
  },
  {
    "value": "bgm",
    "text": "NY - Binghamton"
  },
  {
    "value": "bis",
    "text": "ND - Bismarck"
  },
  {
    "value": "bml",
    "text": "NH - Berlin"
  },
  {
    "value": "bro",
    "text": "TX - Brownsville"
  },
  {
    "value": "bwg",
    "text": "KY - Bowling Green"
  },
  {
    "value": "cad",
    "text": "MI - Cadillac"
  },
  {
    "value": "clt",
    "text": "NC - Charlotte"
  },
  {
    "value": "csg",
    "text": "GA - Columbus"
  },
  {
    "value": "day",
    "text": "OH - Dayton"
  },
  {
    "value": "den",
    "text": "CO - Denver"
  },
  {
    "value": "dsm",
    "text": "IA - Des Moines"
  },
  {
    "value": "eyw",
    "text": "FL - Key West"
  },
  {
    "value": "fcx",
    "text": "VA - Roanoke"
  },
  {
    "value": "hfd",
    "text": "CT - Hartford"
  },
  {
    "value": "jef",
    "text": "MO - Jefferson City"
  },
  {
    "value": "law",
    "text": "OK - Lawton"
  },
  {
    "value": "lbf",
    "text": "NE - North Platte"
  },
  {
    "value": "lit",
    "text": "AR - Little Rock"
  },
  {
    "value": "lwt",
    "text": "MT - Lewistown"
  },
  {
    "value": "msy",
    "text": "LA - New Orleans"
  },
  {
    "value": "myl",
    "text": "ID - McCall"
  },
  {
    "value": "pie",
    "text": "FL - Saint Petersburg"
  },
  {
    "value": "pir",
    "text": "SD - Pierre"
  },
  {
    "value": "prc",
    "text": "AZ - Prescott"
  },
  {
    "value": "pvu",
    "text": "UT - Provo"
  },
  {
    "value": "rdm",
    "text": "OR - Redmond"
  },
  {
    "value": "riw",
    "text": "WY - Riverton"
  },
  {
    "value": "rno",
    "text": "NV - Reno"
  },
  {
    "value": "row",
    "text": "NM - Roswell"
  },
  {
    "value": "sat",
    "text": "TX - San Antonio"
  },
  {
    "value": "shd",
    "text": "VA - Staunton"
  },
  {
    "value": "sln",
    "text": "KS - Salina"
  },
  {
    "value": "spi",
    "text": "IL - Springfield"
  },
  {
    "value": "stc",
    "text": "MN - Saint Cloud"
  },
  {
    "value": "tiw",
    "text": "WA - Tacoma"
  },
  {
    "value": "tvr",
    "text": "MS - Vicksburg"
  }
]


const formatUrl = (value) => `https://s.w-x.co/staticmaps/wu/wxtype/county_loc/${value}/animate.png`
module.exports = class Radar extends BaseModule {
  async handle(data) {
    const { channel } = data;
    if (!data.user_text) {
      return this.sendRadarMessage(channel, "https://s.w-x.co/staticmaps/wu/wxtype/none/usa/animate.png")
    }

    const input = data.user_text.toUpperCase();
    const userRadar = radars.find(it => {
      return it.text.includes(input);
    })
    if (userRadar) {
      return this.sendRadarMessage(channel, formatUrl(userRadar.value))
    }

    this.bot.postMessage(
      channel,
      `Couldn't find ${data.user_text}.\nMaps:\n\`\`\`${radars.map(it => it.text).join('\n')}\`\`\``
    );
  }

  sendRadarMessage(channelId, url) {
    this.bot.postRawMessage(channelId, {
      username: `RadarCat`,
      attachments: [
        {
          color: '#a2a2a2',
          fields: [],
          image_url: url,
        }
      ]
    });
  }

  help() {
    return (
      'Usage: `?radar` gives radar gif.\nAll radars: ' + radars.map(it => it.text).join('\n')
    );
  }

};
