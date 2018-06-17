const express = require('express')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI).then(
  connection => console.log('[MongoDB Connection] success'),
  console.error.bind(console, '[MongoDB Connection] error:'))

// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
var app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

// Add POST - /api/login
router.post('/login', (req, res) => {
  if (req.body.username === 'allen155475' && req.body.password === 'allen155475') {
    req.session.authUser = { username: 'allen155475' }
    return res.json({ username: 'allen155475' })
  }
  res.status(401).json({ message: '無效的帳號密碼' })
})

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  delete req.session.authUser
  res.json({ ok: true })
})

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
  pickUpAddress: {
    type: String,
    required: true,
    maxlength: 200
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

const Order = mongoose.model('Order', orderSchema)

router.post('/orders', (req, res) => {
  Order.create(req.body, (err, order) => {
    if (err) {
      res.status(400).json({message: err})
    } else {
      res.json({ ok: true, order })
    }
  })
})

router.get('/orders', (req, res) => {
  Order.find({}, (err, orders) => {
    if (err) {
      res.status(400).json({message: err})
    } else {
      res.json({ ok: true, orders })
    }
  })
})

router.use((req, res, next) => {
  console.log(req.body)
  console.log(res)
  next()
})

// Export the server middleware
module.exports = {
  path: '/api',
  handler: router
}
