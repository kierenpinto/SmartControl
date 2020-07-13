"use strict";
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./aws_config.json');
AWS.config.region = 'us-west-2';
var endpoint = 'af0fl7pfhxnuf-ats.iot.us-west-2.amazonaws.com';
var iotdata = new AWS.IotData({ endpoint: endpoint });
/**
 * Generic device update operation
 * @param {Device ID } id
 * @param {State for Device to be changed to} new_state
 */
function updateDevice(id, new_state) {
    console.log("made it to device update");
    var topic = "myTopic"; //Change to 'id' after testing
    var payload = JSON.stringify(new_state);
    var params = {
        topic: topic,
        payload: payload,
        qos: 1
    };
    return iotdata.publish(params).promise();
}
/**
 * Specific light update operation
 * @param {Device ID } id
 * @param {State for Device to be changed to} new_state
 */
function updateLight(id, new_state) {
    return updateDevice(id, new_state);
}
/**
 * Specific curtain update operation
 * @param {Device ID } id
 * @param {State for Device to be changed to} new_state
 */
function updateCurtain(id, new_state) {
    return updateDevice(id, new_state);
}
exports.updateLight = updateLight;
exports.updateCurtain = updateCurtain;
//# sourceMappingURL=update_IOT_device.js.map