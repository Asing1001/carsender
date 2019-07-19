const mongoose = require('mongoose')
const { ORDER_STATUS } = require('../../enums')

module.exports = {
  status: {
    'zh-cn': '狀態',
    type: String,
    maxlength: 50,
    required: true,
    validate: val => Object.values(ORDER_STATUS).includes(val)
  },
  serviceType: {
    'zh-cn': '預約類型',
    type: String,
    required: true,
    maxlength: 50
  },
  planeNo: {
    'zh-cn': '航班編號',
    type: String,
    required: true,
    maxlength: 200
  },
  pickUpDate: {
    'zh-cn': '日期',
    type: String,
    required: true,
    maxlength: 20
  },
  pickUpTime: {
    'zh-cn': '時間',
    type: String,
    required: true,
    maxlength: 20
  },
  targetCity: {
    'zh-cn': '城市',
    type: String,
    maxlength: 10,
    default: ''
  },
  targetArea: {
    'zh-cn': '地區',
    type: String,
    maxlength: 20,
    default: ''
  },
  targetAddress: {
    'zh-cn': '地址',
    type: String,
    required: true,
    maxlength: 200
  },
  name: {
    'zh-cn': '姓名',
    type: String,
    required: true,
    maxlength: 100
  },
  phone: {
    'zh-cn': '手機',
    type: String,
    required: true,
    maxlength: 30
  },
  email: {
    'zh-cn': 'email',
    type: String,
    required: false,
    maxlength: 100
  },
  totalPeople: {
    'zh-cn': '人數',
    type: Number,
    required: true,
    max: 200,
    min: 1
  },
  luggage: {
    'zh-cn': '行李數',
    type: String,
    required: true,
    maxlength: 100
  },
  remark: {
    'zh-cn': '備註',
    type: String,
    maxlength: 200
  },
  carType: {
    'zh-cn': '車種',
    type: String,
    required: true,
    maxlength: 100
  },
  amount: {
    'zh-cn': '金額',
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
