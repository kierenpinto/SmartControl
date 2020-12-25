import Light from "../devices/light";
import { updateDeviceStates, FirestoreDevice } from "../firestore/device";
import { DeviceTypes } from "../devices/device";

async function updateLightChain(light:Light,transaction:FirebaseFirestore.Transaction){
    
    const FSDevice = new FirestoreDevice(light.name,DeviceTypes[light.type],light._userRef,new Map(Object.entries(light.states)))
    const prom = updateDeviceStates(light.id,FSDevice,transaction)

    return prom;

}

export {updateLightChain};