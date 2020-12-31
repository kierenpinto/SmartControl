import Light from "../models/devices/light";
import updateDevice from "./common";
/**
 * Specific light update operation
 * @param {Device ID } id 
 * @param {State for Device to be changed to} new_state 
 */
function updateLightIOTDevice(light:Light){
    const new_state = new Map();
    const id = light.id;
    new_state.set('brightness',light.states.brightness);
    new_state.set('on',light.states.on);
    return updateDevice(id,new_state)
}

export {updateLightIOTDevice}
export default updateLightIOTDevice;