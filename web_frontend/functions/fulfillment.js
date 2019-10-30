// Import the appropriate service
const { smarthome } = require('actions-on-google')

// Create an app instance
const app = smarthome()

// Register handlers for Smart Home intents

app.onExecute((body, headers) => {
    return {
      requestId: body.requestId,
      payload: {
        commands: [{
          ids: ["123"],
          status: "SUCCESS",
          states: {
            on: true,
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
            online: true
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
        type: "action.devices.types.OUTLET",
        traits: [
          "action.devices.traits.OnOff"
        ],
        name: {
          defaultNames: ["My Outlet 1234"],
          name: "Night light"
        },
        willReportState: false,
      }]
    },
  }
})

modules.exports = app;