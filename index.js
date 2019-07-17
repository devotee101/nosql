'use strict'

const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

// Connection URL
const user = encodeURIComponent(process.env.MONGO_ROOT_USERNAME)
const password = encodeURIComponent(process.env.MONGO_ROOT_PASSWORD)
const authMechanism = 'DEFAULT'
const url = `mongodb://${user}:${password}@mongo:27017/?authMechanism=${authMechanism}`
console.log(url)
// Database Name
const dbName = 'myproject'

const insertCategories = (db, callback) => {
  // Get the documents collection
  const categories = require('./data/categories.json')

  const collection = db.collection('categories')
  // Insert some documents
  collection.insertMany(categories, (err, result) => {
    assert.strictEqual(err, null)
    console.log('inserted categories')
    callback(result)
  })
}

// Use connect method to connect to the server
MongoClient.connect(url, (err, client) => {
  assert.strictEqual(null, err)
  console.log('Connected successfully to server')

  const db = client.db(dbName)
  insertCategories(db, () => {
    client.close()
  })
  client.close()
})
