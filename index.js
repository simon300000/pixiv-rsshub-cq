/* eslint-disable camelcase */
const { CQWebSocket } = require('cq-websocket')

const bot = new CQWebSocket({
  host: '202.182.101.186',
  accessToken: 'BY38d7hwd7',
  port: 9000
})

bot.on('message.private', (_, { message, user_id }) => {
  bot('send_private_msg', { user_id, message })
})

bot.on('request', async ({ user_id, sub_type, flag, request_type, group_id }) => {
  if (user_id === 2241139100 && request_type === 'group' && sub_type === 'invite') {
    await bot('set_group_add_request', { flag, sub_type })
    console.log('join group', group_id)
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
