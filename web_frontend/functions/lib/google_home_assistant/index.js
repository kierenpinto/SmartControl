"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const actions_on_google_1 = require("actions-on-google");
const execute_1 = require("./execute");
// import * as sync from './sync';
// import * as query from './query';
const app = express();
const fulfillment_app = actions_on_google_1.smarthome();
// Execute Action Request from Google Home -> SmartHome Device
fulfillment_app.onExecute(execute_1.default);
// Return Query results to Google Home
// fulfillment_app.onQuery(query)
// Sync Google Home to SmartHome graph
// fulfillment_app.onSync(sync)
app.post('/fulfillment', fulfillment_app);
app.get('/', (req, res) => res.send('You have reached the fulfillment EndPoint for KpinKonnect'));
exports.default = app;
//# sourceMappingURL=index.js.map