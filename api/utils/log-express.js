const excludedHeaders = [
  'x-frame-options',
  'strict-transport-security',
  'x-content-type-options',
  'x-dns-prefetch-control',
  'x-download-options',
  'x-xss-protection',
  'vary',
  'date',
  'etag',
  'charset'
]

function logExpress({ logger = console, loggerName }) {
  return function(req, res, next) {
    const timestamp = Date.now()
    res.on('finish', () => {
      const {
        method,
        originalUrl,
        body,
        headers: { 'user-agent': userAgent, authorization, referer },
        cookies,
        ip
      } = req
      const clonedHeaders = { ...res.getHeaders() }
      excludedHeaders.forEach(headerKey => delete clonedHeaders[headerKey])
      const spentTime = Date.now() - timestamp
      logger.info({
        logger: loggerName,
        status: res.statusCode.toString(),
        spentTime,
        method: method.toUpperCase(),
        url: originalUrl,
        requestData: body,
        requestHeaders: { userAgent, referer, authorization, cookies, ip },
        responseHeaders: clonedHeaders
      })
    })
    next()
  }
}

module.exports = { logExpress }
