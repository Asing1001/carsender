const mongoose = require('mongoose')
const { ORDER_STATUS } = require('../../orderStatus')

module.exports = {
  status: {
    type: String,
    maxlength: 50,
    default: ORDER_STATUS.CREATED,
    validate: val => !!ORDER_STATUS[val]
  },
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
  },
  carType: {
    type: String,
    required: true,
    maxlength: 100
  },
  amount: {
    type: String,
    required: true,
    maxlength: 100
  },
  _id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  transactionId: {
    type: String,
    maxlength: 100
  }
}
