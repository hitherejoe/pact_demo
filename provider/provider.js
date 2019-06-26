const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const server = express()

server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use((_, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')
  next()
})

const RESPONSE = {
    count: 10,
    userId: 'sadfdsfadfsbfvbcv4564563',
    error: null,
    updates: [
      {id: 5, text: 'Update five', canShareDirect: false},
    ]
  }

server.get('/updates', (req, res) => {
  res.json(RESPONSE)
})

module.exports = {
  server,
}
