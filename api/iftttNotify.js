const axios = require('axios')

const iftttHookUrl =
  process.env.IFTTT_HOOK ||
  'https://maker.ifttt.com/trigger/order_create_qa/with/key/lxH04WN5F3umyo-llPSK4mOVrHs-wz6JPIsl8Tm5e8y'

export function lineNotify(message) {
  return axios.post(iftttHookUrl, { value1: message })
}
