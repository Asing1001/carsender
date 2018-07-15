const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')

mongoose.connect(process.env.MONGODB_URI).then(
  connection => console.log('[MongoDB Connection] success'),
  console.error.bind(console, '[MongoDB Connection] error:'))

const orderSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
    maxlength: 50
  },
  planeNo: {
    type: String,
    required: true,
    maxlength: 200
  },
  pickUpDate: {
    type: String,
    required: true,
    maxlength: 20
  },
  pickUpTime: {
    type: String,
    required: true,
    maxlength: 20
  },
  pickUpCity: {
    type: String,
    maxlength: 10,
    default: ''
  },
  pickUpArea: {
    type: String,
    maxlength: 20,
    default: ''
  },
  pickUpAddress: {
    type: String,
    required: true,
    maxlength: 200
  },
  targetCity: {
    type: String,
    maxlength: 10,
    default: ''
  },
  targetArea: {
    type: String,
    maxlength: 20,
    default: ''
  },
  targetAddress: {
    type: String,
    required: true,
    maxlength: 200
  },
  name: {
    type: String,
    required: true,
    maxlength: 200
  },
  phone: {
    type: String,
    required: true,
    maxlength: 30
  },
  totalPeople: {
    type: Number,
    required: true,
    max: 200,
    min: 1
  },
  remark: {
    type: String,
    maxlength: 200
  }
})

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
const Order = mongoose.model('Order', orderSchema)
const iftttHookUrl = 'https://maker.ifttt.com/trigger/order_create/with/key/' + process.env.IFTTT_HOOK
const router = express.Router()
router.route('/orders')
  .post((req, res) => {
    Order.create(req.body, (err, order) => {
      if (err) {
        res.status(400).json({ message: err })
      } else {
        axios.post(iftttHookUrl, { value1: getLineOrderTemplate(order) })
        res.json({ ok: true, order })
      }
    })
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

router.use(isAuthenticated).route('/orders/:_id')
  .delete((req, res) => {
    Order.deleteOne({ _id: req.params._id }, (err) => {
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
