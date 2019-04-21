const axios = require('axios')
const { stringifyData, logger } = require('./logger')
const originalCreate = axios.create

axios.create = function(...args) {
  const axiosInstance = originalCreate.apply(this, args)
  addInterceptor(axiosInstance)
  return axiosInstance
}
addInterceptor(axios)

function addInterceptor(axiosInstance) {
  axiosInstance.interceptors.request.use(config => {
    config.timestamp = Date.now()
    return config
  })

  axiosInstance.interceptors.response.use(
    response => {
      const {
        config: { headers, timestamp, method, url, data: requestData = '' },
        data,
        status
      } = response
      const spentTime = Date.now() - timestamp
      logger.info({
        logger: 'Request',
        status: status.toString(),
        spentTime,
        method: method.toUpperCase(),
        url,
        requestData,
        requestHeaders: stringifyData(headers),
        responseData: data
      })
      return response
    },
    ({
      message,
      response,
      config: { headers, timestamp, method, url, data: requestData = '' }
    }) => {
      // Response exist means that the request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const spentTime = Date.now() - timestamp
      const hasResponse = response !== undefined
      const status = hasResponse ? response.status.toString() : 'no-response'
      const responseData = hasResponse ? response.data : undefined
      logger.error({
        logger: 'Request',
        status,
        spentTime,
        method: method.toUpperCase(),
        url,
        requestData,
        requestHeaders: stringifyData(headers),
        responseData
      })
      throw message
    }
  )
}
