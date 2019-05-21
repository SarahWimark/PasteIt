'use strict'

require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const csrf = require('csurf')
const flash = require('connect-flash')
const DbStore = require('connect-mongodb-session')(session)
const csp = require('express-csp-header')

const User = require('./models/user')
const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-uxsap.mongodb.net/snippetsDB`
const app = express()
const store = new DbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const snippetRoutes = require('./routes/snippetRouter')
const authRoutes = require('./routes/authRouter')
const adminRoutes = require('./routes/adminRouter')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
})
)
app.use(csp({
  policies: {
    'default-src': [csp.SELF],
    'script-src': [csp.SELF, csp.INLINE, 'https://cdnjs.cloudflare.com'],
    'style-src': [csp.SELF, 'https://cdnjs.cloudflare.com']
  }
}))
app.use(csrf())
app.use(flash())

app.use((req, res, next) => {
  res.locals.authenticated = req.session.loggedIn
  res.locals.csrfToken = req.csrfToken()
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next()
      }
      req.user = user
      return next()
    })
    .catch(err => {
      next(new Error(err))
    })
})

app.use(snippetRoutes)
app.use(authRoutes)
app.use(adminRoutes)

app.use((req, res, next) => {
  return res.status(404).render('errors/404', { pageTitle: '404 Page not found', path: '404' })
})

app.use((req, res, next) => {
  return res.status(403).render('errors/403', { pageTitle: '403 Forbidden', path: '403' })
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).render('errors/500', { pageTitle: '500 Internal Server Error', path: '500', authenticated: req.session.loggedIn })
  return res.redirect('errors/500')
})

mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(3000, () => console.log('Server running at http://localhost:3000'))
  }).catch(err => {
    console.log(err)
  })
