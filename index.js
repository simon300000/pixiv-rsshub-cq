/* eslint-disable camelcase */
const { CQWebSocket, CQImage, CQText } = require('cq-websocket')

const rss = require('./rss')
const knownPictures = new Set()

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const bot = new CQWebSocket({
  host: '127.0.0.1',
  accessToken: 'BY38d7hwd7',
  port: 9000
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

const friends = [2241139100, 3151884870, 179528556]

bot.on('request', async ({ user_id, sub_type, flag, request_type, group_id }) => {
  if (friends.includes(user_id) && request_type === 'group' && sub_type === 'invite') {
    await bot('set_group_add_request', { flag, sub_type })
    console.log('join group', group_id)
  }
  if (friends.includes(user_id) && request_type === 'friend') {
    await bot('set_friend_add_request', { flag })
    console.log('add friend', user_id)
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
