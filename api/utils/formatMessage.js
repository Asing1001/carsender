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

module.exports = { formatMessage, stringifyData }
