// const express = require('express')
// const mongoose = require('mongoose')
const axios = require('axios')

// const router = express.Router()


// const pay = new linePay({
//   channelId: process.env.LINE_PAY_CHANNEL_ID || '1649897844',
//   channelSecret: process.env.LINE_PAY_CHANNEL_SECRET || '9c0a1cef572a6f498467b99f801dc68f',
//   isSandbox: !process.env.LINE_PAY_CHANNEL_ID
// });
const isSandbox = !process.env.LINE_PAY_CHANNEL_ID
const linePayAPI = isSandbox ? 'https://api-pay.line.me/v2/' : 'https://sandbox-api-pay.line.me/v2/'
const payHeaders = {
  "X-LINE-ChannelId": process.env.LINE_PAY_CHANNEL_ID || "1649897844",
  "X-LINE-ChannelSecret": process.env.LINE_PAY_CHANNEL_SECRET || '9c0a1cef572a6f498467b99f801dc68f',
  "Content-Type": "application/json",
}

const client = axios.create({
  baseURL: linePayAPI,
  timeout: 10000,
  headers: payHeaders
});

async function reserve({ order, confirmUrl }) {
  try {
    const linePayOrder = { amount: order.amount, productImageUrl: "", confirmUrl, productName: order.serviceType, currency: order.currency, orderId: order._id }
    const { data } = await client.post('payments/request', linePayOrder)
    console.log(data)
    return data//.info.paymentUrl.web
  } catch (err) {
    console.error(err)
    return false
  }
}

async function confirm(options) {
  const { transactionId, amount, currency } = options
  if (!transactionId || !amount || !currency) {
    console.error('invalid parameters!', options)
    return false
  }

  const { data } = await client.post(`/payments/${transactionId}/confirm`, { amount, currency })

  console.log(data);

  return data
}

module.exports = { reserve, confirm }
