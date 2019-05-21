'use strict'

const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
  res.render('login', {
    path: '/login',
    pageTitle: 'Login'
  })
}

exports.getSignup = (req, res, next) => {
  res.render('signup', {
    path: '/signup',
    pageTitle: 'Signup'
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid e-mail or password')
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
        .then(match => {
          if (match) {
            req.session.loggedIn = true
            req.session.user = user
            return req.session.save(() => {
              req.flash('success', 'You are logged in')
              res.redirect('/snippets')
            })
          }
          req.flash('error', 'Something went wrong while logging in.')
          res.redirect('/login')
        }).catch(err => {
          console.log(err)
          req.flash('error', 'Something went wrong while logging in.')
          res.redirect('/login')
        })
    })
    .catch(err => {
      next(new Error(err))
    })
}

exports.postSignup = (req, res, next) => {
  const password = req.body.password
  if (req.body.password.length < 6) {
    req.flash('error', 'Password has to be atleast 6 characters long.')
    return res.redirect('/signup')
  }
  User.findOne({ email: req.body.email })
    .then(userInfo => {
      if (userInfo) {
        req.flash('error', 'A user with that e-mail already exists')
        return res.redirect('/signup')
      } else if (req.body.password !== req.body.confirm_password) {
        req.flash('error', 'The passwords doesn´t match.')
        return res.redirect('/signup')
      } else {
        return bcrypt.hash(password, 12)
          .then(hashedPassword => {
            const user = new User({
              username: req.body.username,
              email: req.body.email,
              password: hashedPassword

            })
            return user.save()
          })
          .then(result => {
            req.flash('success', 'Signup was sucessful. Enter your e-mail and password to login.')
            res.redirect('/login')
          })
      }
    })
    .catch(err => {
      next(new Error(err))
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}
