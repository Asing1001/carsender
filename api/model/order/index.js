const mongoose = require('mongoose')
const schemaDefinition = require('./schema')
const orderSchema = new mongoose.Schema(schemaDefinition, {
  _id: false,
  timestamps: true
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
