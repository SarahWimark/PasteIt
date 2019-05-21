'use strict'

const Snippet = require('../models/snippet')

exports.getAddSnippet = (req, res, next) => {
  res.render('add_snippet', {
    pageTitle: 'Add Snippet',
    path: '/add_snippet'
  })
}

exports.postAddSnippet = (req, res, next) => {
  const snippet = new Snippet({
    title: req.body.title,
    snippet: req.body.snippet,
    description: req.body.description,
    username: req.user.username
  })
  snippet.save()
    .then(result => {
      req.flash('success', 'Snippet added.')
      res.redirect('/')
    })
    .catch(err => {
      next(new Error(err))
    })
}

exports.getSnippets = (req, res, next) => {
  Snippet.find({ username: req.user.username })
    .sort({ 'created': -1 })
    .then(snippets => {
      res.render('my_snippets', {
        snippets: snippets,
        pageTitle: 'My Snippets',
        path: '/my_snippets'
      })
    })
    .catch(err => {
      next(new Error(err))
    })
}

exports.getEditSnippet = (req, res, next) => {
  const snippetId = req.params.snippetId
  Snippet.findById(snippetId)
    .then(snippet => {
      if (req.user.username === snippet.username) {
        res.render('edit_snippet', {
          pageTitle: 'Edit Snippet',
          path: '/edit-snippet',
          snippet: snippet
        })
      } else {
        req.flash('error', 'You can´t edit another user´s snippet.')
        return res.redirect('/snippets')
      }
    })
    .catch(err => {
      next(new Error(err))
    })
}

exports.postEditSnippet = (req, res, next) => {
  const snippetId = req.body.snippetId
  Snippet.findById(snippetId)
    .then(snippet => {
      snippet.title = req.body.title
      snippet.snippet = req.body.snippet
      snippet.description = req.body.description
      snippet.save()
        .then(result => {
          req.flash('success', 'Snippet was updated.')
          return res.redirect('/my_snippets')
        })
    })
    .catch(err => {
      next(new Error(err))
    })
}

exports.postDeleteSnippet = (req, res, next) => {
  const snippetId = req.body.snippetId
  Snippet.findByIdAndRemove(snippetId)
    .then((snippet) => {
      if (req.user.username === snippet.username) {
        req.flash('success', 'Snippet was deleted.')
        res.redirect('/')
      } else {
        req.flash('error', 'You can´t delete another user´s snippet.')
        return res.redirect('/snippets')
      }
    })
    .catch(err => {
      next(new Error(err))
    })
}
