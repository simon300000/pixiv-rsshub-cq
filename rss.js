const cheerio = require('cheerio')
const Parser = require('rss-parser')
const parser = new Parser()

const list = ['day_r18', 'day_male_r18', 'week_r18']

const fetch = url => parser.parseURL(url)
  .catch(() => {
    console.log('fetch error', url)
    return fetch(url)
  })

const fetchAll = apis => apis.map(api => fetch(`https://rsshub.app/pixiv/ranking/${api}`))

module.exports = async knownPictures => {
  const source = await Promise.all(fetchAll(list))
  const result = source
    .flatMap(({ items, title: feed }) => items
      .filter(({ link }) => {
        if (knownPictures.has(link)) {
          return false
        }
        knownPictures.add(link)
        setTimeout(() => knownPictures.delete(link), 1000 * 60 * 60 * 24 * 7)
        return true
      })
      .map(({ author, title, link, content }) => ({ author, title, link, content, feed })))
    .map(({ content, ...others }) => {
      const $ = cheerio.load(content)
      const images = $('img').toArray().map(({ attribs: { src } }) => src)
      return { ...others, images }
    })
  return result
}
