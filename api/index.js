require('./utils/log-axios')
const express = require('express')
const { router: orderApi } = require('./order')
const { logger } = require('./utils/logger')
const { logExpress } = require('./utils/log-express')
const { connect } = require('./connection')
connect()

// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express().enable('trust proxy')
app.use(logExpress({ logger, loggerName: 'Access' }))

router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

// Add POST - /api/login
router.post('/login', (req, res) => {
  if (
    req.body.username === 'allen155475' &&
    req.body.password === 'allen155475'
  ) {
    req.session.authUser = { username: 'allen155475' }
    return res.json({ username: 'allen155475' })
  }
  res.status(401).json({ message: '無效的帳號密碼' })
})

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  delete req.session.authUser
  res.json({ ok: true })
})

router.use(orderApi)

// Export the server middleware
const apiModule = {
  path: '/api',
  handler: router
}

if (require.main === module) {
  const bodyParser = require('body-parser')
  const session = require('express-session')
  app.use(bodyParser.json())
  app.use(
    session({ secret: 'lienfa-sing', resave: false, saveUninitialized: false })
  )
  app.use((req, res, next) => {
    req.session.authUser = 'test'
    next()
  })
  app.use(apiModule.path, apiModule.handler)
  app.listen('3000', () => console.log('start listening on 3000.'))
} else {
  console.log('api required by nuxt as a module')
}

module.exports = apiModule
