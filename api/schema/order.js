
const mongoose = require('mongoose')

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
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    maxlength: 30
  },
  email: {
    type: String,
    required: false,
    maxlength: 100
  },
  totalPeople: {
    type: Number,
    required: true,
    max: 200,
    min: 1
  },
  luggage: {
    type: String,
    required: true,
    maxlength: 100
  },
  remark: {
    type: String,
    maxlength: 200
  }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
