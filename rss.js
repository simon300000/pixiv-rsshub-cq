const cheerio = require('cheerio')
const Parser = require('rss-parser')
const parser = new Parser()

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const list = ['day_r18', 'day_male_r18', 'week_r18', 'week_r18g']

const knownPictures = new Set()

const fetchAll = apis => apis.map(api => parser.parseURL(`https://rsshub.app/pixiv/ranking/${api}`))

;

(async () => {
  while (true) {
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
    console.log('done')
    await wait(1000 * 60 * 30)
  }
})()
