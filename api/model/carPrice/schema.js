module.exports = {
  displayName: {
    type: String,
    required: true,
    maxlength: 100
  },
  carType: {
    type: String,
    required: true,
    maxlength: 100
  },
  daytimePrice: {
    type: String,
    required: true,
    maxlength: 100
  },
  nighttimePrice: {
    type: String,
    required: true,
    maxlength: 200
  }
}
