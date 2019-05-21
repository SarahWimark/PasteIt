'use strict'

const express = require('express')

const router = express.Router()

const snippetController = require('../controllers/snippetController')

router.get('/', snippetController.getSnippets)

router.get('/snippets', snippetController.getSnippets)

router.get('/snippets/:snippetId', snippetController.getSnippet)

router.post('/search', snippetController.searchSnippets)

module.exports = router
