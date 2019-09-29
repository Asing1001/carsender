const mongoose = require('mongoose')
const schemaDefinition = require('./schema')

const schema = new mongoose.Schema(schemaDefinition)

const model = mongoose.model('Misc', schema)
module.exports = model
