// Import the appropriate service
const { smarthome } = require('actions-on-google')
device_fulfill = require('./device-fulfillment');
// Create an app instance
const app = smarthome()

// Register handlers for Smart Home intents

app.onExecute((body, headers) => {
    let inputs = body.inputs
    //let command = inputs.payload.commands[0];
    //let device = command.devices[0]
    //console.log(JSON.stringify({'body':body,'headers':headers}))
    return {
      requestId: body.requestId,
      payload: {
        commands: [{
          ids: ["7b2tIs3OqKRAA8xjnBEg"],
          status: "SUCCESS",
          states: {
            openPercent: 100.0,
            online: true
          }
        }]
      }
    };
  });
  

app.onQuery((body, headers) => {
  return {
    requestId: body.requestId,
    payload: {
      devices: {
        "7b2tIs3OqKRAA8xjnBEg": {
          on: true,
          online: true,
          openPercent: 100.0
        }
      }
    },
  }
})

app.onSync((body, headers) => {
  return device_fulfill.proc_sync_req('HjGMm3dinXuCxNFuzfm6').then(devices =>{
    return {
      requestId: body.requestId,
      payload: {
        agentUserId: body.agentUserId,
        devices: devices
      },
    }
  }).catch(err=>console.error(err))

  /* //Reference
  return {
    requestId: body.requestId,
    payload: {
      agentUserId: body.agentUserId,
      devices: [{
        id: "7b2tIs3OqKRAA8xjnBEg",
        type: "action.devices.types.CURTAIN",
        traits: [
          //"action.devices.traits.OnOff",
          'action.devices.traits.OpenClose',
        ],
        name: {
          defaultNames: ["My Curtains"],
          name: "Kieren's Bedroom Curtain"
        },
        willReportState: false,
      }]
    },
  }*/
})

module.exports = app;