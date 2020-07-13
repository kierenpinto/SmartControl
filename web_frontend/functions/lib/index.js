"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// import * as app_fulfillment from './fulfillment';
// import bodyParseApp  from './react_client';
// import {device_update} from './firestore_triggers';
const google_home_assistant_1 = require("./google_home_assistant");
// Initialise admin SDK
admin.initializeApp();
// Google Assistant Actions Endpoint
//exports.fulfillment = functions.https.onRequest(app_fulfillment);
exports.google_asssistant_fulfillment = functions.https.onRequest(google_home_assistant_1.default);
// Authentication endpoint for Okta and Firebase AUTH for React Client
//exports.react_client = functions.https.onRequest(<any>bodyParseApp);
// const {device_update} = require('./firestore_triggers');
//exports.device_update = device_update
//# sourceMappingURL=index.js.map