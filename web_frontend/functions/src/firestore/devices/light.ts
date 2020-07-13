import { FirestoreDevice } from "../device";
import Light, { LightStates } from "../../devices/light";


function FirestoreToLight(id:string, FSDevice:FirestoreDevice):Light{
    if (FSDevice.type !== 'lights'){
        throw new Error("A device that is not a light has been converted");
    }
    const states = new LightStates(FSDevice.states.get('brightness'),FSDevice.states.get('on'));
    
    const light = new Light(id,FSDevice.name,states,FSDevice.userRef.id,FSDevice.userRef);
    return light;
}

function LightToFirestore(light:Light):FirestoreDevice{
    const states = new Map();
    states.set("brightness", light.states.brightness);
    states.set("on",light.states.on);
    return new FirestoreDevice(light.name,"lights",light._userRef,states);
}
export {FirestoreToLight, LightToFirestore}