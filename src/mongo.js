'use strict'

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
    console.log(`MongoDB\t\t- inserted data into from ${file}`)
    callback(result)
  })
}

const options = {
  useNewUrlParser: true,
  sslValidate: true,
  sslCA: process.env.MONGO_HOST.indexOf('amazonaws') > 0 ? ca : undefined
}

module.exports = {
  test: (items) => {
    // Use connect method to connect to the server

    MongoClient.connect(url, options, (err, client) => {
      assert.strictEqual(null, err)
      console.log('MongoDB\t\t- Connected successfully to server')

      const db = client.db(dbName)
      items.forEach(item => insertData(db, item, () => { 
        if (items[items.length - 1] === item) {
          client.close()
        }
      }))
    })
  }
}
