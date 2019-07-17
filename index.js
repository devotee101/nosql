'use strict'

const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const fs = require('fs')
const path = require('path')

// Connection URL
const user = encodeURIComponent(process.env.MONGO_ROOT_USERNAME)
const password = encodeURIComponent(process.env.MONGO_ROOT_PASSWORD)
const url = `mongodb://${user}:${password}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_PARAMS}`

// Database Name
const dbName = 'myproject'

const insertData = (db, file, callback) => {
  const data = require(`./data/${file}`)

  const collection = db.collection(path.parse(file).name)
  // Insert some documents
  collection.insertMany(data, (err, result) => {
    assert.strictEqual(err, null)
    console.log(`inserted data from ${file}`)
    callback(result)
  })
}

// Use connect method to connect to the server
MongoClient.connect(url, (err, client) => {
  assert.strictEqual(null, err)
  console.log('Connected successfully to server')

  const db = client.db(dbName)

  fs.readdir(`${__dirname}/data`, function (err, items) {
    assert.strictEqual(err, null)
    for (var i = 0; i < items.length; i++) {
      insertData(db, items[i], () => {})
    }
    client.close()
  })
})
