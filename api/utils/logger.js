const { format, transports, createLogger } = require('winston')

const getPlainMessage = winstonInfo => {
  if (typeof winstonInfo.message === 'object') {
    return { ...winstonInfo, message: formatMessage(winstonInfo.message) }
  }
  return winstonInfo
}

const formatMessage = message => {
  if (typeof message === 'object') {
    let formattedMessage = ''
    Object.entries(message).forEach(([key, val]) => {
      if (typeof val === 'object') {
        formattedMessage += `[${stringifyData(val)}]`
      } else if (val === undefined) {
        formattedMessage += '[]'
      } else {
        formattedMessage += key === 'spentTime' ? `[${val}ms]` : `[${val}]`
      }
    })
    return formattedMessage
  }
  return message
}

const stringifyData = (data, length = 1000) => {
  if (data === undefined) {
    return ''
  }
  return JSON.stringify(data).substr(0, length)
}

const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format(getPlainMessage)(),
        format.simple()
      )
    })
  ]
})

// Workaround to fix winston transport bug
// Error.stack and Error.message are not enumerable, it leads to property lost when Object.assign({}, info)
// https://github.com/winstonjs/winston-transport/issues/31
const nativeError = logger.error
logger.error = function(...args) {
  if (args[0] instanceof Error) {
    const error = args[0]
    const { message, stack } = error
    const log = { message: stack || message, ...error }
    if (message && message.includes('RESOURCE_NOT_FOUND')) {
      return logger.warn.call(this, log)
    }
    return nativeError.call(this, log)
  }
  return nativeError.apply(this, args)
}

// Handle uncaught exception in winston
logger.on('error', err => console.error('winston logger got error' + err))

module.exports = { logger, formatMessage, stringifyData }
