const express = require('express')
const app = express()
const port = 3000
const curtains_route = require('./curtains')
const root_route = require('./root')


app.use('/',root_route)

app.use('/curtains',curtains_route)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
