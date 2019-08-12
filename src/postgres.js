'use strict'

const massive = require('massive')
const assert = require('assert')
const path = require('path')

async function loadData (items, db) {
  return new Promise(resolve => {
    items.forEach(item => insertData(db, item, () => {
      if (items[items.length - 1] === item) {
        resolve()
      }
    }))
  })
}

async function queryData (db) {
  const shippers = await db.shippers.findDoc({ shipperID: 1 })
  assert.strictEqual(shippers[0].shipperID, 1)
  console.log(`PostgreSQL\t- Successfully queried for shipper`)

  const products = await db.products.findDoc({ supplierID: 2 })
  assert.strictEqual(products.length, 4)
  console.log(`PostgreSQL\t- Successfully queried for products`)
}

const insertData = async (db, file, cb) => {
  const data = require(`./data/${file}`)
  const name = path.parse(file).name

  // Delete all
  const table = db[name]
  if (table !== undefined) {
    const result = await table.destroy()
    console.log(`PostgreSQL\t- deleted ${result.length} rows from ${file} table`)

    // Insert some documents
    await db.saveDocs(name, data)
    console.log(`PostgreSQL\t- inserted ${data.length} objects from ${file}`)

    cb()
  }
}

module.exports = {
  test: async (items) => {
    const db = await massive({
      host: process.env.POSTGRES_HOST,
      port: 5432,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    })

    await loadData(items, db)
    await queryData(db)
  }
}
