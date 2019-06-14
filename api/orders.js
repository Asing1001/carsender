const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const Order = require('./schema/order')
const CarPrice = require('./schema/carPrice')
const pay = require('./pay')
const { logger } = require('./utils/logger')
const { getCarPrice } = require('./utils/getCarPrice')

const isAuthenticated = (req, res, next) => {
  if (!req.session.authUser) {
    res.status(401).json({ message: '請登入以繼續' })
  } else {
    next()
  }
}

const getLineOrderTemplate = ({
  serviceType,
  pickUpDate,
  pickUpTime,
  targetCity,
  targetArea,
  targetAddress,
  name,
  phone,
  totalPeople,
  remark
}) =>
  `${serviceType} <br>
  訂位者: ${name} ${phone} 共${totalPeople}人 <br>
  時間: ${pickUpDate} ${pickUpTime} <br>
  地址: ${targetCity + targetArea + targetAddress} <br>
  備註: ${remark}
`

const iftttHookUrl =
  process.env.IFTTT_HOOK ||
  'https://maker.ifttt.com/trigger/order_create_qa/with/key/lxH04WN5F3umyo-llPSK4mOVrHs-wz6JPIsl8Tm5e8y'
const router = express.Router()

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

router
  .route('/orders')
  .post(async (req, res) => {
    try {
      const order = { ...req.body }
      order.amount = await getOrderAmount(order)
      order._id = mongoose.Types.ObjectId()
      logger.info('order', order)
      const confirmUrl = `${req.protocol}://${req.get('host')}/api/confirm`
      const response = await pay.reserve({ order, confirmUrl })

      order.transactionId = `reserve-${response.info.transactionId}`
      const orderDoc = await Order.create(order)
      logger.info('order create and reserved!', orderDoc)

      res.json({ ok: true, paymentUrl: response.info.paymentUrl.web })
    } catch (err) {
      logger.error(err)
      res.status(400).json({ message: err })
    }
  })
  .get(isAuthenticated, (req, res) => {
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

module.exports = router
