const Parser = require('rss-parser')
const parser = new Parser()

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const list = ['day_r18', 'day_male_r18', 'week_r18', 'week_r18g']

const fetchAll = apis => apis.map(api => parser.parseURL(`https://rsshub.app/pixiv/ranking/${api}`))

;

(async () => {
  while (true) {
    const source = await Promise.all(fetchAll(list))
    source.forEach(({ items, title }) => {
      console.log(title)
      console.log(items.length)
    })
    console.log('done')
    await wait(3000)
  }
})()
