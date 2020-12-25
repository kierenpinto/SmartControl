import { SmartHomeHandler, SmartHomeV1ExecuteRequest, SmartHomeV1ExecuteResponse, SmartHomeV1ExecuteResponseCommands, SmartHomeV1ExecuteRequestExecution, SmartHomeV1ExecutePayload } from "actions-on-google";
import { deviceTransaction, getDevice, firestoreToDevice, updateDeviceStates } from "../../firestore/device";
import { isNull } from "lodash";
import { DeviceTypes } from "../../devices/device";
import { executeLight } from "./light";
import { LightToFirestore } from "../../firestore/devices/light";


/**
 * @function execute
 * @param {*} body Body of Request
 * @param {*} headers Headers in the Request
 * @returns {Array<String>} Array of Device IDs
 */

const execute: SmartHomeHandler<SmartHomeV1ExecuteRequest, SmartHomeV1ExecuteResponse> = async function (body, headers) {
    try {
        // Clean data
        // const fixBody = JSON.parse(JSON.stringify(body))
        //const inputs = body.inputs;

        // Run Query
        const payload = await parseExecute(body);
        // const command_response:SmartHomeV1ExecuteResponseCommands[] = [];
        // Format Response:
        const response: SmartHomeV1ExecuteResponse = {
            requestId: body.requestId,
            payload: payload
        }
        return response

    } catch (error) {
        console.error(error);
        const command_response: SmartHomeV1ExecuteResponseCommands[] = [];
        const response: SmartHomeV1ExecuteResponse = {
            requestId: body.requestId,
            payload: {
                commands: command_response,
            },
        }
        return response
    }
}

/**
 * 
 * @param request 
 * 
 */

async function parseExecute(request: SmartHomeV1ExecuteRequest): Promise<SmartHomeV1ExecutePayload> {
    const inputs = request.inputs;

    try {
        // const input_response = inputs.map(input =>{
        const input = inputs[0];
        if (input.intent == "action.devices.EXECUTE") {// check for execute intent
            const command_result = await Promise.all(
                input.payload.commands.map(async command => {
                    const device_ids = command.devices.map((d) => d.id)
                    const instructions = command.execution
                    // const instructResult =
                    await runActions(device_ids, instructions);
                    return <SmartHomeV1ExecuteResponseCommands>{ ids: device_ids, status: "SUCCESS" };
                }))
            const payload = { commands: command_result } // finish
            return payload
        } else {
            throw new Error("A non-execute request was triggered on the execute hook")
            //const payload = []
        }
        // })
    } catch (error) {
        console.error(error)
        const debugString = String(error);
        const payload: SmartHomeV1ExecutePayload = { commands: [], debugString: "Failed to parse execute: " + debugString, errorCode: "ERROR" }
        return payload
    }

}

/**
 * 
 * @param devices[]
 * @param instructions[]
 * 
 * ADD RETURN TYPE!!
 */

async function runActions(devices: string[], instructions: SmartHomeV1ExecuteRequestExecution[]) {
    // Run Instructions on Each Device
    const deviceResults = devices.map(async device_id => {

        async function transact(t: FirebaseFirestore.Transaction): Promise<boolean> {
            const FSdevice = await getDevice(device_id, t)
            const device = firestoreToDevice(device_id, FSdevice);
            if (!isNull(device)) {
                switch (device.type) {
                    case DeviceTypes.Light:
                        //handle light
                        const lightModified = executeLight(device, instructions)
                        const updatedFSdevice = LightToFirestore(lightModified);
                        await updateDeviceStates(lightModified.id, updatedFSdevice, t);
                        return Promise.resolve(true);
                    case DeviceTypes.Curtain:
                    //handle curtain
                    default:
                        return Promise.reject("Invalid Device Types") // throw exception

                }
            } else {
                return Promise.reject("Invalid Device Types - Device is Null"); //throw exception
            }
        }

        return deviceTransaction(transact);

    })
    return deviceResults
}

export default execute;