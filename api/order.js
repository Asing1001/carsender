const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const Order = require('./model/order')
const CarPrice = require('./model/carPrice')
const pay = require('./pay')
const { logger } = require('./utils/logger')
const { getCarPrice } = require('./utils/getCarPrice')
const { ORDER_STATUS } = require('./orderStatus')
const orderSchema = require('./model/order/schema')

const isAuthenticated = (req, res, next) => {
  if (!req.session.authUser) {
    res.status(401).json({ message: '請登入以繼續' })
  } else {
    next()
  }
}

export const getLineOrderTemplate = ({ __v, ...order }) => {
  return Object.entries(order).reduce((prev, [key, value]) => {
    const outputKey = (orderSchema[key] && orderSchema[key]['zh-cn']) || key
    return (prev += `${outputKey}: ${value}<br>`)
  }, '')
}

const iftttHookUrl =
  process.env.IFTTT_HOOK ||
  'https://maker.ifttt.com/trigger/order_create_qa/with/key/lxH04WN5F3umyo-llPSK4mOVrHs-wz6JPIsl8Tm5e8y'

export const router = express.Router()

router.route('/confirm').get(async (req, res, next) => {
  if (!req.query || !req.query.transactionId) {
    return res.status(400).send('Transaction id not found.')
  }

  try {
    const transactionId = req.query.transactionId
    const order = await Order.findById(req.query.orderId).exec()
    logger.info(order)
    await pay.confirm({
      transactionId,
      amount: order.amount
    })
    order.transactionId = transactionId
    order.status = ORDER_STATUS.PAID
    Order.updateOne({ _id: order._id }, order).exec()
    axios.post(iftttHookUrl, { value1: getLineOrderTemplate(order) })

    res.redirect(`/order/result?orderId=${order._id}`)
  } catch (err) {
    logger.error(err)
    res.status(400).send(err)
  }
})

async function getOrderAmount(order) {
  const car = await CarPrice.findOne({ carType: order.carType }).exec()
  logger.info('find car for the order', car)
  const orderPrice = getCarPrice({ car, pickUpTime: order.pickUpTime })
  return orderPrice
}

router.route('/carPrice').get(async (req, res) => {
  const carPrice = await CarPrice.find({}).exec()
  res.send(carPrice)
})

router.route('/order').post(async (req, res) => {
  try {
    // reserve order required an orderId
    const order = {
      ...req.body,
      _id: mongoose.Types.ObjectId()
    }
    order.amount = await getOrderAmount(order)
    logger.info('order', order)
    let redirectUrl

    if (order.payment.toLowerCase() === 'line') {
      const response = await pay.reserve({
        order,
        confirmUrl: `${req.protocol}://${req.get('host')}/api/confirm`
      })
      order.transactionId = `reserve-${response.info.transactionId}`
      redirectUrl = response.info.paymentUrl.web
    } else {
      redirectUrl = `/order/result?orderId=${order._id}`
    }

    order.status = ORDER_STATUS.UNPAID
    const orderDoc = await Order.create(order)
    logger.info('order create!', orderDoc)

    res.json({ ok: true, redirectUrl })
  } catch (err) {
    logger.error(err)
    res.status(400).json({ message: err })
  }
})

router.route('/orders').get(isAuthenticated, (req, res) => {
  Order.find({}, (err, orders) => {
    if (err) {
      res.status(500).json({ message: err })
    } else {
      res.json({ ok: true, orders })
    }
  })
})

router
  .use(isAuthenticated)
  .route('/order/:_id')
  .delete((req, res) => {
    Order.deleteOne({ _id: req.params._id }, err => {
      if (err) {
        res.status(500).json({ message: err })
      } else {
        res.json({ ok: true })
      }
    })
  })
  .put((req, res) => {
    Order.updateOne({ _id: req.params._id }, req.body, (err, order) => {
      if (err) {
        res.status(400).json({ message: err })
      } else {
        res.json({ ok: true, order })
      }
    })
  })
