import Light from "../devices/light";
import updateDevice from "./common";
// import { DeviceActions, DeviceActionResponse } from "../devices/device";
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

// class LightActions extends DeviceActions{
//     device:Light
//     public onSwitch(on:boolean){
//         this.actions.set('on',on);
//     }

//     public brightness(amount:number){
//         this.actions.set('brightness',amount);
//     };

//     /**
//      * Light object that represents the current state of the light device
//      * @param light 
//      */
//     constructor(light:Light){
//         super();
//         this.device = light;
//     }

//     public runActions(): Map<string, DeviceActionResponse> {
        
//         const brightness = this.actions.get('brightness')
//         const on = this.actions.get('on');

        
//         // Send commant to IOT device

//         // await response from IOT device

//         //Update database

//         //await response from database

//         //return response


//         // Comment out when done

//         throw new Error("Method not implemented.");
//     }
    

// }

export {updateLightIOTDevice}
export default updateLightIOTDevice;