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

// IOT Integration

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var endpoint = 'af0fl7pfhxnuf-ats.iot.us-west-2.amazonaws.com';
var iotdata = new AWS.IotData({endpoint: endpoint})
var topic = "myTopic"
var payload = "ON"
var params = {
  topic: topic,
  payload: payload,
  qos: 1
}

app.get('/iot', (req,res)=>{
  iotdata.publish(params,(err,data)=>{
    res.json({err:err, data:data})
  })

})

module.exports = app;