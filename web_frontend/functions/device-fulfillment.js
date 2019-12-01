/* Import firebase */
const admin = require("firebase-admin");
// admin.initializeApp();
let db = admin.firestore() // Init Firestore
const deviceRef = db.collection("devices");
const usersRef = db.collection('users');
// Sample Body Input
/* { "inputs": [
    { "context": {
        "locale_country": "AU", "locale_language": "en" 
        }, "intent": "action.devices.EXECUTE", 
        "payload": {
            "commands": [
                { "devices": [{ "id": "123" }], "execution": [
                    { "command": "action.devices.commands.OpenClose", "params": { "openPercent": 100 } 
                }] 
            }] 
        } 
    }], "requestId": "13182237911901383771" 
} */


function proc_execute_req(body) {
    // processes the execute request
    return new Promise ((resolve,reject)=>{
        let inputs = body.inputs;
        let command_response = [];
        inputs.forEach(input => {
            let commands_list = input.payload.commands;
            let response = commands_list.map(command_set => {
                let devices = command_set.devices;
                let device_id_array = devices.map(device => {
                    command_set.execution.forEach(execute => {
                        execute_single(device.id, execute)
                    })
                    return device.id
                })
                let states = command_set.execution.reduce((array,exec)=>Object.assign(array,exec.params),{})
                //console.log("states",states)
                return {ids:device_id_array, status:"SUCCESS",states:states}
            })
            console.log("Single Response",JSON.stringify(response))
            command_response = command_response.concat(response);
        });
        resolve(command_response)
    })
}

function execute_single(device_id, execute) {
    // Executes a single action
    // Look up id in database and to find out what type of device it is
    return deviceRef.doc(device_id).update({states:execute.params})
    // Switch based on device type to execute - or change the parameters in the database
}


function proc_sync_req(user_id) {
    // Grab user
    let devices;
    let devices_promises = usersRef.doc(user_id).get().then(user_doc => {
        devices = user_doc.data().devices;
        device_list = []
        devices.forEach(device => {
            //console.log(device.type,device.id);
            device_list.push(db.collection("devices").doc(device.id).get())// returns an array bunch of promises
        })
        return Promise.all(device_list)
    }).catch(err=>console.log(err))
    // Scan user for supported devices - ie that fit the schema
    // Construct a list:
    return (devices_promises).then(device_docs => {
        return device_docs.map((doc,index)=>{
            let name = doc.data().name
            return {
                id: devices[index].id,
                type: "action.devices.types.CURTAIN",
                traits: [
                    'action.devices.traits.OpenClose',
                ],
                name: {
                    defaultNames: ["My Curtains"],
                    name: name
                },
                willReportState: false,
            }
        })
    }).catch(err=>console.log(err))
}

// Test proc_sync_req
//console.log("invoke",proc_sync_req('HjGMm3dinXuCxNFuzfm6').then(out=>console.log("final out",out)))


/**
 * @function proc_query_req Processes the Query Request from Google Assistant Actions
 * @param {Array} device_id_list Array of Device IDs
 * @returns {Promise} promise of all device states as an array {state_obj:state Obj, id: device_id}
 */
function proc_query_req(device_id_list) {
    let all_device_promises = Promise.all(device_id_list.map(id=>{
        console.log("device id",id)
        return deviceRef.doc(id).get()
    }))
    console.log("Device Promises",JSON.stringify(all_device_promises))
    return (all_device_promises).then(devices=>{
        return new Promise((resolve,reject)=>{
            console.log("devices",JSON.stringify(devices))
            let states = []
            devices.forEach((device,index) =>{
                // Assume only curtains for now:
                let doc = device.data()
                let ret_obj = {state_obj:doc.states, id: device_id_list[index]}
                console.log(ret_obj)
                states.push(ret_obj);
            })
            console.log("states",states)
            resolve(states)
        })
    }).catch(err=>console.log(err))
}



module.exports = {
    proc_sync_req:proc_sync_req, // Export SYNC function
    proc_query_req:proc_query_req, // Export QUERY function
    proc_execute_req:proc_execute_req //Export EXECUTE function
}
