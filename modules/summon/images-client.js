const fs = require('fs');
const axios = require('axios');

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
}

const getImages = async (query, random) => {
  const url = `https://www.bing.com/images/search?q=${query}&FORM=HDRSC2`
  console.log(url)

  const header = { 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36" }
  const { data } = await axios.get(url, { headers: header });
  const images = extractImages(data);

  if (random) {
    return images.slice(0, 20).random();
  }
  return images[0];
}

const extractImages = (data) => {
  const regex = /src="(?<subdomain>https:\/\/[^>]*)\.bing\.net(?<path>[^"]+)"/gm
  const str = data.toString();
  let m;
  const result = [];
  fs.writeFileSync('./test.html', data);
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      let sanitizedPath = m.groups.path.replace(/w=\d+&amp;/g, "")
      sanitizedPath = sanitizedPath.replace(/h=\d+&amp;/, "")
      result.push(`${m.groups.subdomain}.bing.net${sanitizedPath}`);
    });
  }
  return result;
}

module.exports.getImages = getImages