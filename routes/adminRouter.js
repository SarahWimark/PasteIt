'use strict'

const express = require('express')

const router = express.Router()

const adminController = require('../controllers/adminController')
const authenticated = require('../util/authenticated')

router.get('/add_snippet', authenticated, adminController.getAddSnippet)

router.post('/add_snippet', authenticated, adminController.postAddSnippet)

router.get('/my_snippets', authenticated, adminController.getSnippets)

router.get('/edit_snippet/:snippetId', authenticated, adminController.getEditSnippet)

router.post('/edit_snippet', authenticated, adminController.postEditSnippet)

router.post('/delete_snippet', authenticated, adminController.postDeleteSnippet)

module.exports = router
