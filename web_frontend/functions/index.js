const admin = require("firebase-admin");
admin.initializeApp();
const functions = require('firebase-functions');

// Google Assistant Actions Endpoint
const app_fulfillment = require('./fulfillment');
exports.fulfillment = functions.https.onRequest(app_fulfillment);

// Authentication endpoint for Okta and Firebase AUTH for React Client
const react_client = require('./react_client');
exports.react_client = functions.https.onRequest(react_client)

const {device_update} = require('./firestore_triggers');
exports.device_update = device_update