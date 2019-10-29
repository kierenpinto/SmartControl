const functions = require('firebase-functions');
const cors = require('cors')
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {

 if (request.method === "GET"){
    if (request.body){
        response.send(JSON.stringify(request.body))
    }else{
        response.send("Hello from Firebase - no body here - GET");
    }
 }else{
    if (request.body){
        response.send(JSON.stringify(request.body))
    }else{
        response.send("Hello from Firebase - no body here - POST");
    }
}});

const express = require('express')
const app = express()

const curtains_route = require('./curtains')

app.use(cors({origin: true}))
//app.use(express.json()) // Add JSON middleware
app.get('/', (req, res) => res.send('Hello World!'))

app.use('/curtains',curtains_route)

exports.widgets = functions.https.onRequest(app);
