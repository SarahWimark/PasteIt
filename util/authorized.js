module.exports.isAuthorized = (req, res, next) => {
  if (!req.session.user.username === req.user.username) {
    req.flash('error', 'You can´t edit or delete another user´s snippet.')
    return res.redirect('/snippets')
  }
  return next()
}
