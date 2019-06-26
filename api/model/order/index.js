const mongoose = require('mongoose')
const schemaDefinition = require('./schema')
const orderSchema = new mongoose.Schema(schemaDefinition, { _id: false })

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
