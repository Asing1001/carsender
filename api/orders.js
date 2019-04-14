const express = require('express')
const Order = require('./schema/order')
const cache = require("memory-cache");
const pay = require('./pay')
// const linePay = require("line-pay");


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
  pickUpCity,
  pickUpArea,
  pickUpAddress,
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
  地點: ${pickUpCity + pickUpArea + pickUpAddress} <br>
  目的地: ${targetCity + targetArea + targetAddress} <br>
  備註: ${remark}
`

const iftttHookUrl =
  process.env.IFTTT_HOOK ||
  'https://maker.ifttt.com/trigger/order_create_qa/with/key/lxH04WN5F3umyo-llPSK4mOVrHs-wz6JPIsl8Tm5e8y'
const router = express.Router()

router.route('/confirm')
  .get(async (req, res, next) => {
    if (!req.query || !req.query.transactionId) {
      return res.status(400).send("Transaction id not found.");
    }

    try {
      const transactionId = req.query.transactionId;
      console.log(transactionId)
      const order = cache.get(transactionId);
      console.log(cache.keys())
      console.log(order)
      const response = await pay.confirm({
        transactionId: transactionId,
        amount: order.amount,
        currency: order.currency
      })
      res.send(response)
    } catch (err) {
      console.error(err)
      res.status(400).send(err)
    }
  });

router
  .route('/orders')
  .post((req, res) => {
    Order.create(req.body, async (err, order) => {
      if (err) {
        res.status(400).json({ message: err })
      } else {
        console.log('order create!', order)
        order.amount = 1
        order.currency = 'TWD'
        // const reservation = {
        //   productName: "My product",
        //   amount: 1,
        //   currency: "JPY",
        //   confirmUrl: process.env.LINE_PAY_CONFIRM_URL || `https://${req.hostname}/pay/confirm`,
        //   confirmUrlType: "SERVER",
        //   orderId: `${event.source.userId}-${Date.now()}`
        // }
        const confirmUrl = `${req.protocol}://${req.get('host')}/api/confirm`
        const response = await pay.reserve({ order, confirmUrl })
        cache.put(response.info.transactionId, order);
        // axios.post(iftttHookUrl, { value1: getLineOrderTemplate(order) })
        res.json({ ok: true, paymentUrl: response.info.paymentUrl.web })
      }
    })
  })
  .get(isAuthenticated, (req, res) => {
    console.log(req)
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
