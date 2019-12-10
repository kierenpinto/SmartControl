/* Initialise Firebase Admin SDK */
const admin = require("firebase-admin");
var serviceAccount = require("./firebase_admin_key.json")
const firebase_config = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smc2-e0416.firebaseio.com"  
}
admin.initializeApp(firebase_config);

/* Initialise Express */
const express = require('express') // Require Express Framework
const bodyParser = require('body-parser') //Required for Fulfillment API
const expressApp = express().use(bodyParser.json())
const app_fulfillment = require('./fulfillment');
const react_client = require('./react_client');
expressApp.use('/client',react_client)
expressApp.get('/',(req,res)=>{
    res.send("Root API Request")
})
expressApp.all('/fulfillment',app_fulfillment) // Fulfill google-assistant-actions
// expressApp.listen(3000, ()=> console.log('listening'))

/* Wrap and export app with Serverless framework */
const serverless = require('serverless-http');
module.exports.handler = serverless(expressApp);