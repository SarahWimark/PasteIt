module.exports = (req, res, next) => {
  if (!req.session.loggedIn) {
    req.flash('error', 'You need to be logged in to perform that action.')
    return res.redirect('/login')
  }
  next()
}
