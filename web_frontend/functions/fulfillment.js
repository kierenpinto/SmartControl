// Import the appropriate service
const { smarthome } = require('actions-on-google')

// Create an app instance
const app = smarthome()

// Register handlers for Smart Home intents

app.onExecute((body, headers) => {
    let inputs = body.inputs
    let command = inputs.payload.commands[0];
    let device = command.devices[0]
    return {
      requestId: body.requestId,
      payload: {
        commands: [{
          ids: ["123"],
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
        123: {
          on: true,
          online: true,
          openPercent: 100.0
        }
      }
    },
  }
})

app.onSync((body, headers) => {
  return {
    requestId: body.requestId,
    payload: {
      agentUserId: body.agentUserId,
      devices: [{
        id: "123",
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
  }
})

module.exports = app;