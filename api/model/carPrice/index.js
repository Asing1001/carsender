const mongoose = require('mongoose')
const schemaDefinition = require('./schema')

const carPriceSchema = new mongoose.Schema(schemaDefinition)

const carPrice = mongoose.model('CarPrice', carPriceSchema)
module.exports = carPrice
