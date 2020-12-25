import * as functions from 'firebase-functions';
// import * as app_fulfillment from './fulfillment';
// import bodyParseApp  from './react_client';
// import {device_update} from './firestore_triggers';
import google_assistant from './google_home_assistant';

// Google Assistant Actions Endpoint
//exports.fulfillment = functions.https.onRequest(app_fulfillment);

exports.google_asssistant_fulfillment = functions.https.onRequest(google_assistant)

// Authentication endpoint for Okta and Firebase AUTH for React Client
//exports.react_client = functions.https.onRequest(<any>bodyParseApp);

// const {device_update} = require('./firestore_triggers');
// exports.device_update = device_update