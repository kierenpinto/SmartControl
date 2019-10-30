const functions = require('firebase-functions');
const cors = require('cors')
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const app_fulfillment = require('./fulfillment');

exports.fulfillment = functions.https.onRequest(app_fulfillment);


// OLD CURTAINS API
/* const express = require('express')
const app = express()
const curtains_route = require('./curtains')
app.use(cors({origin: true}))
//app.use(express.json()) // Add JSON middleware
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/curtains',curtains_route)
exports.widgets = functions.https.onRequest(app); */
