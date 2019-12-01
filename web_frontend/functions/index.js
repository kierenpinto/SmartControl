const admin = require("firebase-admin");
admin.initializeApp();
const functions = require('firebase-functions');
const cors = require('cors')
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const app_fulfillment = require('./fulfillment');

exports.fulfillment = functions.https.onRequest(app_fulfillment);

const react_client = require('./react_client');
exports.react_client = functions.https.onRequest(react_client)
