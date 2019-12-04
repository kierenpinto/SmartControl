const admin = require("firebase-admin");
var serviceAccount = require("./firebase_admin_key.json")
const firebase_config = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smc2-e0416.firebaseio.com"  
}
admin.initializeApp(firebase_config);

const app_fulfillment = require('./fulfillment');

const express = require('express') // Require Express Framework
const bodyParser = require('body-parser') // Including fulfillment inside express app-need body Parser middleware

const expressApp = express().use(bodyParser.json())
let db = admin.firestore()

expressApp.get('/',(req,res)=>{
    db.collection('users').doc('HjGMm3dinXuCxNFuzfm6').get().then(doc=>{
        if(doc.exists){
            res.send(doc.data())
        }else{
            res.send("document doesn't existttt")
        }
    })
})
expressApp.all('/fulfillment',app_fulfillment)
// expressApp.listen(3000, ()=> console.log('listening'))

const serverless = require('serverless-http');
module.exports.handler = serverless(expressApp);