const url = require('url')
const axios = require('axios')
const fixieUrl = url.parse(
  process.env.FIXIE_URL ||
    'http://fixie:0lgWxt8mqAbJRct@velodrome.usefixie.com:80'
)

const isSandbox = !process.env.LINE_PAY_CHANNEL_ID
const linePayAPI = isSandbox
  ? 'https://api-pay.line.me/v2/'
  : 'https://sandbox-api-pay.line.me/v2/'
const payHeaders = {
  'X-LINE-ChannelId': process.env.LINE_PAY_CHANNEL_ID || '1649897844',
  'X-LINE-ChannelSecret':
    process.env.LINE_PAY_CHANNEL_SECRET || '9c0a1cef572a6f498467b99f801dc68f',
  'Content-Type': 'application/json'
}
const request = require('request')
const fixieRequest = request.defaults({
  proxy: fixieUrl,
  headers: payHeaders,
  baseUrl: linePayAPI,
  timeout: 10000
})

const client = axios.create({
  baseURL: linePayAPI,
  timeout: 10000,
  headers: payHeaders,
  // Fixie https://devcenter.heroku.com/articles/fixie#using-with-node
  proxy: {
    host: fixieUrl.hostname,
    port: fixieUrl.port,
    auth: fixieUrl.auth
  }
})

async function reserve({ order, confirmUrl }) {
  const linePayOrder = {
    amount: order.amount,
    productImageUrl: '',
    confirmUrl,
    productName: order.serviceType,
    currency: 'TWD',
    orderId: order._id
    // confirmUrlType: 'SERVER' // to indicate its web
  }
  return new Promise(resolve => {
    fixieRequest.post(
      'payments/request',
      { json: linePayOrder },
      (error, res, body) => {
        if (error) {
          console.error(error)
          return
        }
        console.log(`statusCode: ${res.statusCode}`)
        console.log(body)
        resolve(body)
      }
    )
  })
  // const { data } = await client.post('payments/request', linePayOrder)
  return res
}

async function confirm(options) {
  const { transactionId, amount, currency = 'TWD' } = options
  if (!transactionId || !amount || !currency) {
    throw new Error('invalid parameters!', options)
  }

  const { data } = await client.post(`/payments/${transactionId}/confirm`, {
    amount,
    currency
  })

  return data
}

module.exports = { reserve, confirm }
