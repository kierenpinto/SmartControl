import { FirestoreDevice, usersRef } from ".";
import { DeviceTypes } from "../../models/devices";
import Light, { LightStates } from "../../models/devices/light";

/*
Holds the light models for the firestore database.
*/
class NoDeviceUserError extends Error {
    constructor(){
        super();
        this.name = 'NoDeviceUserError'
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoDeviceUserError)
        }
        this.message = "There was no user assignmed to this device. This is a critical failure!"
    }
}

const LightFirestoreConverter: FirebaseFirestore.FirestoreDataConverter<Light> = {
    toFirestore(light:Light): FirebaseFirestore.DocumentData {
        const states = new Map();
        states.set("brightness", light.states.brightness);
        states.set("on",light.states.on);
        const userRef = usersRef.doc(light.user)
        return new FirestoreDevice(light.name,DeviceTypes.Light,userRef,states);
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot){
        const id = snapshot.id;
        const data = <FirestoreDevice> snapshot.data(); // Assume that it is of shape FirestoreDevice
        if (data.type !== 'light'){
            throw new Error(`A device of type ${data.type} cannot be converted with LightFirestoreConverter`);
        }

        //Ensure name is a string and exists
        if (!data.name){
            data.name = 'Unnamed Light'
        }
        const name = String(data.name);

        // Ensure userReference exists otherwise error.
        if (!data.userRef || !(data.userRef instanceof FirebaseFirestore.DocumentReference)){
            throw new NoDeviceUserError();
        } else {
            data.userRef = data.userRef;
        }

        // Ensure states are represented in a Map
        let statesMap = data.states;
        if (!(statesMap && statesMap instanceof Map)){
            statesMap = new Map();
        }
        const states = new LightStates(statesMap.get('brightness'),statesMap.get('on'));
        return new Light(id,name,states,data.userRef.id);
    }
}

export {LightFirestoreConverter}