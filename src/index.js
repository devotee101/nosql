'use strict'

require('dotenv').config()
const fs = require('fs')
const mongo = require('./mongo')
const pg = require('./postgres')

// Read data files
fs.readdir(`${__dirname}/data`, (err, items) => {
  if (!err) {
    mongo.test(items)
    pg.test(items)
  }
})
