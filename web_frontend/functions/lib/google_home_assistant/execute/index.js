"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = require("../../firestore/device");
const lodash_1 = require("lodash");
const device_2 = require("../../devices/device");
const light_1 = require("./light");
const light_2 = require("../../firestore/devices/light");
/**
 * @function execute
 * @param {*} body Body of Request
 * @param {*} headers Headers in the Request
 * @returns {Array<String>} Array of Device IDs
 */
const execute = async function (body, headers) {
    try {
        // Clean data
        // const fixBody = JSON.parse(JSON.stringify(body))
        //const inputs = body.inputs;
        // Run Query
        const payload = await parseExecute(body);
        // const command_response:SmartHomeV1ExecuteResponseCommands[] = [];
        // Format Response:
        const response = {
            requestId: body.requestId,
            payload: payload
        };
        return response;
    }
    catch (error) {
        console.error(error);
        const command_response = [];
        const response = {
            requestId: body.requestId,
            payload: {
                commands: command_response,
            },
        };
        return response;
    }
};
/**
 *
 * @param request
 *
 */
async function parseExecute(request) {
    const inputs = request.inputs;
    try {
        // const input_response = inputs.map(input =>{
        const input = inputs[0];
        if (input.intent == "action.devices.EXECUTE") { // check for execute intent
            const command_result = await Promise.all(input.payload.commands.map(async (command) => {
                const device_ids = command.devices.map((d) => d.id);
                const instructions = command.execution;
                // const instructResult =
                await runActions(device_ids, instructions);
                return { ids: device_ids, status: "SUCCESS" };
            }));
            const payload = { commands: command_result }; // finish
            return payload;
        }
        else {
            throw new Error("A non-execute request was triggered on the execute hook");
            //const payload = []
        }
        // })
    }
    catch (error) {
        console.error(error);
        const debugString = String(error);
        const payload = { commands: [], debugString: "Failed to parse execute: " + debugString, errorCode: "ERROR" };
        return payload;
    }
}
/**
 *
 * @param devices[]
 * @param instructions[]
 *
 * ADD RETURN TYPE!!
 */
async function runActions(devices, instructions) {
    // Run Instructions on Each Device
    const deviceResults = devices.map(async (device_id) => {
        async function transact(t) {
            const FSdevice = await device_1.getDevice(device_id, t);
            const device = device_1.firestoreToDevice(device_id, FSdevice);
            if (!lodash_1.isNull(device)) {
                switch (device.type) {
                    case device_2.DeviceTypes.Light:
                        //handle light
                        const lightModified = light_1.executeLight(device, instructions);
                        const updatedFSdevice = light_2.LightToFirestore(lightModified);
                        await device_1.updateDeviceStates(lightModified.id, updatedFSdevice, t);
                        return Promise.resolve(true);
                    case device_2.DeviceTypes.Curtain:
                    //handle curtain
                    default:
                        return Promise.reject("Invalid Device Types"); // throw exception
                }
            }
            else {
                return Promise.reject("Invalid Device Types - Device is Null"); //throw exception
            }
        }
        return device_1.deviceTransaction(transact);
    });
    return deviceResults;
}
exports.default = execute;
//# sourceMappingURL=index.js.map