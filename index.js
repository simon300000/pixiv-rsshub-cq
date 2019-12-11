const { CQWebSocket, CQImage, CQText } = require('cq-websocket')

const rss = require('./rss')
const knownPictures = new Set()

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const bot = new CQWebSocket({
  host: '127.0.0.1',
  port: 6700
})

bot.once('socket.connect', async () => {
  while (true) {
    const items = await rss(knownPictures)
    await Promise.all(items
      .map(({ author, title, link, images, feed }) => [new CQText(`${title} by ${author} from ${feed}\n${link}`), ...images.map(url => new CQImage(url))])
      .map(message => bot('send_group_msg', {
        group_id: 829736941,
        message
      })))
    console.log('done', items.length)
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
