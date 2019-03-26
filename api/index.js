const express = require('express')
const orderApi = require('./orders')

// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
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
module.exports = {
  path: '/api',
  handler: router
}
