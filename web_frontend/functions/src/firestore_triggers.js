// Needed to update the application/devices when changes to database occur.

const functions = require('firebase-functions');
const {updateLight, updateCurtain} = require('./update_IOT_device');

exports.device_update = functions.firestore.document('devices/{deviceId}').onUpdate((change,context)=>{
    const deviceObj = change.after.data();
    //Check object type:
    const device_type = deviceObj.type;
    const device_id = change.after.id;
    let operation_promise = true;
    console.log(deviceObj,device_id)
    switch (device_type) {
        case 'lights':
            console.log("LIGHT chosen")
            operation_promise = updateLight(device_id,deviceObj.states)
            break;
        case 'curtains':
            console.log("LIGHT chosen")
            operation_promise = updateCurtain(device_id,deviceObj.states)
            break;
        default:
            console.error("Invalid Device Type")
            break;
    }
    return operation_promise
})