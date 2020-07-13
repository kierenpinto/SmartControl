import * as express from 'express';
import {smarthome} from 'actions-on-google';
import execute from './execute';
// import * as sync from './sync';
// import * as query from './query';
const app = express()

const fulfillment_app = smarthome();

// Execute Action Request from Google Home -> SmartHome Device
fulfillment_app.onExecute(execute)

// Return Query results to Google Home
// fulfillment_app.onQuery(query)

// Sync Google Home to SmartHome graph
// fulfillment_app.onSync(sync)

app.post('/fulfillment', fulfillment_app);
app.get('/', (req, res) => res.send('You have reached the fulfillment EndPoint for KpinKonnect'))

export default app;