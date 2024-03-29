import { lineNotify } from './lineNotify'

const express = require('express')
const mongoose = require('mongoose')
const Order = require('./model/order')
const CarPrice = require('./model/carPrice')
const Misc = require('./model/misc')
const pay = require('./pay')
const { logger } = require('./utils/logger')
const { getCarPrice } = require('./utils/getCarPrice')
const { ORDER_STATUS } = require('./enums')
const orderSchema = require('./model/order/schema')

const isAuthenticated = (req, res, next) => {
  if (!req.session.authUser) {
    res.status(401).json({ message: '請登入以繼續' })
  } else {
    next()
  }
}

export async function orderLineNotify(order) {
  try {
    logger.info('send notification message')
    await lineNotify(getLineOrderTemplate(order))
  } catch (error) {
    logger.error(error)
  }
}

export const getLineOrderTemplate = ({ __v, ...order }) => {
  return Object.entries(order).reduce((prev, [key, value]) => {
    const outputKey = (orderSchema[key] && orderSchema[key]['zh-cn']) || key
    return (prev += `${outputKey}: ${value}\n`)
  }, '')
}

export const router = express.Router()

router.route('/confirm').get(async (req, res, next) => {
  if (!req.query || !req.query.transactionId) {
    return res.status(400).send('Transaction id not found.')
  }

  try {
    const transactionId = req.query.transactionId
    const order = await Order.findById(req.session.orderId).exec()
    logger.info(order.toJSON())
    await pay.confirm({
      transactionId,
      amount: order.amount
    })
    order.transactionId = transactionId
    order.status = ORDER_STATUS.PAID
    await order.update(order).exec()
    await orderLineNotify(order.toJSON())
    res.redirect(`/order/result?orderId=${order._id}`)
  } catch (err) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

async function getOrderAmount(order) {
  const airport = order.serviceType.includes('松山') ? '松山' : '桃園'
  const car = await CarPrice.findOne({
    airport,
    carType: order.carType
  }).exec()
  logger.info('find car for the order', car)
  const orderPrice = getCarPrice({ car, pickUpTime: order.pickUpTime })
  return orderPrice
}

router.route('/carPrice').get(async (req, res) => {
  const carPrice = await CarPrice.find({}).exec()
  res.send(carPrice)
})

router.route('/reminder').get(async (req, res) => {
  const misc = await Misc.findOne({ key: 'reminder' }).exec()
  res.send(misc.value)
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

    if (order.payment.toUpperCase() === 'LINE') {
      const response = await pay.reserve({
        order,
        confirmUrl: `${req.protocol}://${req.get('host')}/api/confirm`
      })
      order.transactionId = `reserve-${response.info.transactionId}`
      redirectUrl = response.info.paymentUrl.web
      req.session.orderId = order._id
    }

    order.status = ORDER_STATUS.UNPAID
    const orderDoc = await Order.create(order)

    if (order.payment.toUpperCase() === 'ATM') {
      await orderLineNotify(order)
      redirectUrl = `/order/atm?orderId=${order._id}`
    }
    logger.info('order create!', orderDoc.toJSON())

    res.json({ ok: true, redirectUrl })
  } catch (err) {
    logger.error(err)
    res.status(400).json({ message: err })
  }
})

router.route('/orders').get(isAuthenticated, (req, res) => {
  Order.find({ status: { $ne: ORDER_STATUS.DELETE } }, (err, orders) => {
    if (err) {
      res.status(500).json({ message: err })
    } else {
      res.json({ ok: true, orders })
    }
  })
})

router.route('/order/:_id').get((req, res) => {
  Order.findOne({ _id: req.params._id }, (err, doc) => {
    if (err) {
      res.status(500).json({ message: err })
    } else if (!doc) {
      res.status(404)
    } else {
      res.send(getLineOrderTemplate(doc.toJSON()))
    }
  })
})

router
  .use(isAuthenticated)
  .route('/order/:_id')
  .delete((req, res) => {
    Order.updateOne(
      { _id: req.params._id },
      { status: ORDER_STATUS.DELETE },
      err => {
        if (err) {
          res.status(500).json({ message: err })
        } else {
          res.json({ ok: true })
        }
      }
    )
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
