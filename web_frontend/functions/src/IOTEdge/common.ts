import * as AWS from 'aws-sdk';
AWS.config.loadFromPath('./aws_config.json');
AWS.config.region = 'us-west-2';
const endpoint = 'af0fl7pfhxnuf-ats.iot.us-west-2.amazonaws.com';
const iotdata = new AWS.IotData({endpoint: endpoint})

/**
 * Generic device update operation
 * @param {Device ID } id 
 * @param {State for Device to be changed to} new_state 
 */
function updateDevice(id:string,new_state:Map<string,any>){
    console.log("made it to device update")
    const topic = id;
    const payload = JSON.stringify(new_state)
    const params = {
      topic: topic,
      payload: payload,
      qos: 1
    }
    return iotdata.publish(params).promise()
}

export {updateDevice}
export default updateDevice;