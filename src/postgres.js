'use strict'

const massive = require('massive')
const assert = require('assert')
const fs = require('fs')
const path = require('path')

const insertData = (db, file, callback) => {
  const data = require(`./data/${file}`)
  const name = path.parse(file).name

  // Delete all
  const table = db[name]
  if (table !== undefined) {
    table.destroy()
      .then((result) => {
        console.log(`deleted ${result.length} rows from ${file} PostgreSQL table`)
        // Insert some documents
        db.saveDocs(name, data)
          .then(result => {
            console.log(`inserted ${data.length} objects into PostgreSQL from ${file}`)
            callback(result)
          }).catch((err) => {
            console.log(`error saving documents: ${err}`)
            throw err
          })
      })
      .catch(err => {
        console.error(err)
        throw err
      })
  }
}

module.exports = {
  loadData: () => {
    massive({
      host: process.env.POSTGRES_HOST,
      port: 5432,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    }).then(db => {
      console.log('connected to PostgreSQL!')
      fs.readdir(`${__dirname}/data`, function (err, items) {
        assert.strictEqual(err, null)
        items.forEach(item => insertData(db, item, () => { }))
      })
    }).catch((err) => {
      console.error(err)
      console.log(`error connecting to ${process.env.POSTGRES_HOST}`)
    })
  }
}
