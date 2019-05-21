'use strict'

const Snippet = require('../models/snippet')
const moment = require('moment')

const SNIPPETS_PER_PAGE = 3

exports.getSnippets = (req, res, next) => {
  const page = +req.query.page || 1
  let numOfSnippets

  Snippet.find()
    .countDocuments()
    .then(numSnippets => {
      numOfSnippets = numSnippets
      return Snippet.find()
        .sort({ 'created': -1 })
        .skip((page - 1) * SNIPPETS_PER_PAGE)
        .limit(SNIPPETS_PER_PAGE)
    })
    .then(snippets => {
      res.render('index', {
        snippets: snippets,
        pageTitle: 'Snippets overview',
        path: '/snippets',
        currentPage: page,
        hasNextPage: SNIPPETS_PER_PAGE * page < numOfSnippets,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(numOfSnippets / SNIPPETS_PER_PAGE)
      })
    })
    .catch(err => {
      next(new Error(err))
    })
}

exports.getSnippet = (req, res, next) => {
  const snippetId = req.params.snippetId
  Snippet.findById(snippetId)
    .then(snippet => {
      res.render('snippet_detail', {
        snippet: snippet,
        pageTitle: snippet.title,
        created: moment(snippet.created).format('YYYY-DD-MM'),
        user: !req.session.user ? '' : req.user.username,
        path: '/snippets'
      })
    })
    .catch(err => {
      next(new Error(err))
    })
}

exports.searchSnippets = (req, res, next) => {
  let searchterm = req.body.search
  Snippet.find({ $text: { $search: searchterm } })
    .sort({ 'created': -1 })
    .then(snippets => {
      req.flash('info', 'Results matching your searchterm.')
      res.render('search_result', {
        snippets: snippets,
        pageTitle: 'Search result',
        path: '/search'
      })
    })
    .catch(err => {
      next(new Error(err))
    })
}
