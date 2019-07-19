'use strict'

require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const fs = require('fs')
const path = require('path')

// Connection URL
const user = encodeURIComponent(process.env.MONGO_ROOT_USERNAME)
const password = encodeURIComponent(process.env.MONGO_ROOT_PASSWORD)
const url = `mongodb://${user}:${password}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_PARAMS}`

// Specify the Amazon DocumentDB cert
var ca = [fs.readFileSync('rds-combined-ca-bundle.pem')]

// Database Name
const dbName = 'ffc-spike-mongo'

const insertData = (db, file, callback) => {
  const data = require(`./data/${file}`)
  const name = path.parse(file).name
  const collection = db.collection(name)

  // Delete all
  collection.deleteMany()

  // Insert some documents
  collection.insertMany(data, (err, result) => {
    assert.strictEqual(err, null)
    console.log(`inserted data from ${file}`)
    callback(result)
  })
}

// Use connect method to connect to the server
const options = {
  useNewUrlParser: true,
  sslValidate: true,
  sslCA: process.env.MONGO_HOST.indexOf('amazonaws') > 0 ? ca : undefined
}

MongoClient.connect(url, options, (err, client) => {
  assert.strictEqual(null, err)
  console.log('Connected successfully to server')

  const db = client.db(dbName)

  fs.readdir(`${__dirname}/data`, function (err, items) {
    assert.strictEqual(err, null)
    items.forEach(item => insertData(db, item, () => { }))
    client.close()
  })
})
