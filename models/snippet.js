'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const snippetSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  username: {
    type: String,
    required: true
  }
})

snippetSchema.index({ '$**': 'text' })

module.exports = mongoose.model('Snippet', snippetSchema)
