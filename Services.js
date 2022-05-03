export async function getWebPage(url) {
  return fetch(url, {
    method: 'GET',
  })
    .then(response => {
      if (response.ok) {
        // console.log(
        //   'Successfull fetch operation. Response status: ',
        //   response.status,
        // );
        return response.text();
      }
      throw new Error('Error occured returning events:' + response.status);
    })
    .catch(error => {
      console.log('Error occurred during fetch operation: ', error.message);
      throw new Error(error.message);
    });
}

const cheerio = require('react-native-cheerio');
export async function getLink(url) {
  return getWebPage(url)
    .then(result => {
      const document = result;
      const $ = cheerio.load(document);
      const link = $(
        'body > section.search > div > div.row > div.col-lg-9.my-3 > div.search-articles > div > a:nth-child(1)',
      ).attr().href;
      return link;
    })
    .catch(error => {
      console.log(`Unable to load data: ${error.message}`);
      return null;
    });
}

export async function getIngredientEffect(url) {
  // const url = 'https://incibeauty.com/en/search/k/aqua';
  return getWebPage(url)
    .then(result => {
      const document = result;
      const $ = cheerio.load(document);
      const effect = $(
        'body > section:nth-child(3) > div > div > div > div.content-fleur.my-3 > div > span',
      ).text();
      // console.log(effect);
      return effect;
    })
    .catch(error => {
      console.log(`Unable to load data: ${error.message}`);
      return null;
    });
  // console.log(url);
}
