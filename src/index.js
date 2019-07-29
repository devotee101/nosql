'use strict'

require('dotenv').config()
const mongo = require('./mongo')
const pg = require('./postgres')

//mongo.loadData()

pg.loadData()
