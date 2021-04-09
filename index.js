/* eslint-disable @typescript-eslint/camelcase */
const { CQWebSocket, CQImage, CQText } = require('cq-websocket')

const rss = require('./rss')
const knownPictures = new Set()

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const bot = new CQWebSocket({
  host: '127.0.0.1',
  port: 6701
})

const group_id = 123

bot.once('socket.connect', async () => {
  await wait(1000 * 5)
  await bot('send_group_msg', {
    group_id,
    message: [new CQText('Hi, ich bin bot')]
  })
  while (true) {
    const items = await rss(knownPictures)
    let w = 0
    console.log('Pending', items.length)
    while (items.length) {
      await wait(1000)
      const { author, title, link, images, feed } = items.shift()
      console.log(title, images.length)
      const message = [new CQText(`${title} by ${author} from ${feed}\n${link}\n`), ...images.map(url => new CQImage(url))]
      await bot('send_group_msg', {
        group_id,
        message
      })
      w++
    }
    console.log('done', w)
    await wait(1000 * 60 * 30)
  }
})

bot.on('socket.connecting', (_socketType, attempts) => {
  console.log('CONNECTING', attempts)
})

bot.on('socket.connect', (_socketType, _sock, attempts) => {
  console.log('CONNECT', attempts)
})

bot.on('socket.failed', (_socketType, attempts) => {
  console.error('FAILED', attempts)
})

bot.on('socket.error', e => {
  console.error('ERROR', e)
})

bot.connect()
