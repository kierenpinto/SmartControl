// Import the appropriate service
const { smarthome } = require('actions-on-google')
device_fulfill = require('./device-fulfillment');
// Create an app instance
const app = smarthome()

// Register handlers for Smart Home intents

app.onExecute((body, headers) => {
  console.log("Execute Request Body",body)
    return device_fulfill.proc_execute_req(JSON.parse(JSON.stringify(body))).then(command_response=>{
      let response = {
        requestId: body.requestId,
        payload: {
          commands:command_response
        }
      }
      //console.log(response)
      return response
    }).catch(err=>console.error(err))
  });

/**
 * @function query_req_ids
 * @param {*} body Body of Request
 * @returns {Array<String>} Array of Device IDs
 */
function query_req_ids(body) {
  let inputs = body.inputs;
  let all_ids = []
  inputs.forEach(input => {
    let device_ids = input.payload.devices.map(device => {
      return device.id; // grab the device id
    }) // a list of device ids for a given input element
    all_ids = all_ids.concat(device_ids); // concats all the input elements' ids.
  })
  return all_ids // array of device ids
}

app.onQuery((body, headers) => {
  console.log("Query Request Body",body)
  let ids = query_req_ids(JSON.parse(JSON.stringify(body)));
  return device_fulfill.proc_query_req(ids).then(all_states=>{
    let devices = all_states.reduce((accum_obj,state)=>{
      let device_obj = {[state.id]:{openPercent:state.state_obj.openPercent, on:true, online: true}}
      let new_obj = Object.assign(accum_obj,device_obj);
      //console.log("device obj",device_obj)
      //console.log("new_obj",new_obj)
      return new_obj
    },{})
    //console.log("Query Devices",JSON.stringify(devices))
    return {
      requestId: body.requestId,
      payload: {
        devices: devices
      }
    }
  }).catch(err=>console.error(err))
})

app.onSync((body, headers) => {
  console.log("Sync Request Body",body)
  return device_fulfill.proc_sync_req('HjGMm3dinXuCxNFuzfm6').then(devices =>{
    return {
      requestId: body.requestId,
      payload: {
        agentUserId: body.agentUserId,
        devices: devices
      },
    }
  }).catch(err=>console.error(err))
})

module.exports = app;