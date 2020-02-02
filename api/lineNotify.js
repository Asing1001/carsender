const qs = require('querystring')
const axios = require('axios')

const config = {
  headers: {
    Authorization: `Bearer ${process.env.LINE_NOTIFY_TOKEN ||
      '1wK0qzJlyzfgTcTjlEMpMJ5Im2wyOGJjVGrTmyxb7hx'}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

function lineNotify(message) {
  return axios.post(
    'https://notify-api.line.me/api/notify',
    qs.stringify({ message }),
    config
  )
}

module.exports = { lineNotify }
