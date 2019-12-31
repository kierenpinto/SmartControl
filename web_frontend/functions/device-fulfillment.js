/* Import firebase */
const admin = require("firebase-admin");
let db = admin.firestore() // Init Firestore
const deviceRef = db.collection("devices");
const usersRef = db.collection('users');
var _ = require('lodash/core')

function proc_execute_req(body) {
    // processes the execute request
    return new Promise ((resolve,reject)=>{
        let inputs = body.inputs;
        
        let command_response = inputs.map(input => {
            let commands_list = input.payload.commands;
            let responses = commands_list.map(command_set => {
                let devices = command_set.devices;
                const device_id_array = devices.map(device => { return device.id });
                let states = command_set.execution.reduce((array, exec) => Object.assign(array, exec.params), {});//console.log("states",states)
                //Service Commands
                return Promise.all(devices.map(device => {
                    return Promise.all(command_set.execution.map(execute => { return execute_single(device.id, execute) }))
                })).then(() => {
                    return Promise.resolve({ ids: device_id_array, status: "SUCCESS", states: states })
                });
            })
            return Promise.all(responses)
            //command_response = command_response.concat(responses);
        });
        Promise.all(command_response).then((cmd)=>{
            console.log(cmd)
            return resolve(_.flatten(cmd))
        })
            .catch((err)=>console.error(err))
        // resolve(command_response)`
    })
}

const CommandTypeMap = {
    "action.devices.commands.OnOff":{loc:"states.on",param:"on"},
    "action.devices.commands.BrightnessAbsolute":{loc:"states.brightness",param:"brightness"},
    //"action.devices.commands.ColorAbsolute":,
}

function execute_single(device_id, execute) {
    // Executes a single action
    // Look up id in database and to find out what type of device it is
    const singleRef = deviceRef.doc(device_id)
    let transaction = db.runTransaction(t =>{
        return t.get(singleRef)
            .then(doc =>{
            let device_type = doc.data().type;
            switch (device_type) {
                case "curtains":
                    t.update(singleRef,{states:execute.params})
                    // console.log("Curtains Ran")
                    return Promise.resolve("Curtains Complete Execution")
                case "lights":
                    t.update(singleRef,{[CommandTypeMap[execute.command].loc]:execute.params[CommandTypeMap[execute.command].param]})
                    // console.log("Lights Ran")
                    return Promise.resolve("Lights Completed Execution") 
                default:
                    return Promise.reject(Error("Invalid Device Type"))
                    
            }
            //console.log("",singleRef,execute)
        })
    }).catch(err=>console.error(err))
    // Switch based on device type to execute - or change the parameters in the database
    return transaction
}

const DeviceTypeMap = {
    "curtains":"action.devices.types.CURTAIN",
    "lights":"action.devices.types.LIGHT",
}

const DeviceTraitMap = {
    "curtains":[
        'action.devices.traits.OpenClose',
    ],
    "lights":[
        "action.devices.traits.Brightness",
        //"action.devices.traits.ColorSetting",
        "action.devices.traits.OnOff",
    ]
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
    }).catch(err=>console.error(err))
    // Scan user for supported devices - ie that fit the schema
    // Construct a list:
    return (devices_promises).then(device_docs => {
        return device_docs.map((doc,index)=>{
            const data = doc.data();
            let name = data.name;
            let type = data.type;
            return {
                id: devices[index].id,
                type: DeviceTypeMap[type],
                traits: DeviceTraitMap[type],
                name: {
                    defaultNames: ["My Curtains"],
                    name: name
                },
                willReportState: false,
            }
        })
    }).catch(err=>console.error(err))
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
        //console.log("device id",id)
        return deviceRef.doc(id).get()
    }))
    //console.log("Device Promises",JSON.stringify(all_device_promises))
    return (all_device_promises).then(devices=>{
        return new Promise((resolve,reject)=>{
            //console.log("devices",JSON.stringify(devices))
            let states = []
            devices.forEach((device,index) =>{
                // Assume only curtains for now:
                let doc = device.data()
                let ret_obj = {state_obj:doc.states, id: device_id_list[index]}
                //console.log(ret_obj)
                states.push(ret_obj);
            })
            //console.log("states",states)
            resolve(states)
        })
    }).catch(err=>console.log(err))
}



module.exports = {
    proc_sync_req:proc_sync_req, // Export SYNC function
    proc_query_req:proc_query_req, // Export QUERY function
    proc_execute_req:proc_execute_req //Export EXECUTE function
}
