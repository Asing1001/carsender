const express = require('express')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI).then(
  connection => console.log('[MongoDB Connection] success'),
  console.error.bind(console, '[MongoDB Connection] error:'))

const orderSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
    maxlength: 50
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
    maxlength: 10
  },
  pickUpArea: {
    type: String,
    maxlength: 20
  },
  pickUpAddress: {
    type: String,
    required: true,
    maxlength: 200
  },
  targetCity: {
    type: String,
    maxlength: 10
  },
  targetArea: {
    type: String,
    maxlength: 20
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

const Order = mongoose.model('Order', orderSchema)

const router = express.Router()
router.route('/orders')
  .post((req, res) => {
    Order.create(req.body, (err, order) => {
      if (err) {
        res.status(400).json({message: err})
      } else {
        res.json({ ok: true, order })
      }
    })
  })
  .get(isAuthenticated, (req, res) => {
    Order.find({}, (err, orders) => {
      if (err) {
        res.status(500).json({message: err})
      } else {
        res.json({ ok: true, orders })
      }
    })
  })

router.use(isAuthenticated).route('/orders/:_id')
  .delete((req, res) => {
    Order.deleteOne({_id: req.params._id}, (err) => {
      if (err) {
        res.status(500).json({message: err})
      } else {
        res.json({ ok: true })
      }
    })
  })
  .put((req, res) => {
    Order.updateOne({_id: req.params._id}, req.body, (err, order) => {
      if (err) {
        res.status(400).json({message: err})
      } else {
        res.json({ ok: true, order })
      }
    })
  })

module.exports = router
