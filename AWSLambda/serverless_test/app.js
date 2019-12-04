'use strict'
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.get('/', (req, res) => {
  res.send("hi- this is your client app")
})

module.exports = app;