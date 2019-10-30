/* Import firebase */
const admin = require("firebase-admin");
admin.initializeApp();
let db = admin.firestore() // Init Firestore

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
    let inputs = body.inputs;
    inputs.forEach(input => {
        let commands_list = input.payload.commands;
        commands_list.forEach(command_set => {
            let devices = command_set.devices;
            devices.forEach(device => {
                command_set.execution.forEach(execute => {
                    execute_single(device.id, execute)
                })
            })

        })
    });
}

function execute_single(device_id, execute) {
    // Executes a single action

    // Look up id in database and to find out what type of device it is

    // Switch based on device type to execute - or change the parameters in the database

}

const usersRef = db.collection('users');
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

const deviceRef = db.collection("devices");
function proc_query_req(body) {
    let inputs = body.inputs;
    let all_device_promises = []
    inputs.forEach(input => {
        let devices = input.payload.devices;
        let devices_promise = devices.map(device => {
            let id = device.id;
            // get the state of each device and put it into  an object
            return deviceRef.doc(id).get() // return promise for each device
        })
        all_device_promises.concat(devices_promise);
    })

    //return promise of all device states - as an array
    return Promise.all(all_device_promises).then(devices=>{
        let states = devices.map(device =>{
            // Assume only curtains for now:
            let doc = device.doc()
            return doc.states.open
        })
        return states
    }).catch(err=>console.log(err))
}



module.exports = {
    proc_sync_req:proc_sync_req
}
