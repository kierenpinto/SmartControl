import { FirestoreDevice, FirestoreDeviceDBAdapter } from ".";
import { homeRef } from "..";
import { DeviceTypes } from "../../models/devices";
import Light, { LightStates } from "../../models/devices/light";
import { NoDeviceUserError } from "./errors";

/*
Holds the light dbtabase adapters and converters for the firestore database.
*/

export class FirestoreLightDBAdapter extends FirestoreDeviceDBAdapter<Light> {
    FirestoreConverter: FirebaseFirestore.FirestoreDataConverter<Light> = LightFirestoreConverter;
}

export const LightFirestoreConverter: FirebaseFirestore.FirestoreDataConverter<Light> = {
    toFirestore(light:Light): FirebaseFirestore.DocumentData {
        const states = new Map();
        states.set("brightness", light.states.brightness);
        states.set("on",light.states.on);
        const home = homeRef.doc(light.home)
        return new FirestoreDevice(light.name,DeviceTypes.Light,home,states);
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

        // Ensure homeReference exists otherwise error.
        if (!data.homeRef || !(data.homeRef instanceof FirebaseFirestore.DocumentReference)){
            throw new NoDeviceUserError();
        } else {
            data.homeRef = data.homeRef;
        }

        // Ensure states are represented in a Map
        let statesMap = data.states;
        if (!(statesMap && statesMap instanceof Map)){
            statesMap = new Map();
        }
        const states = new LightStates(statesMap.get('brightness'),statesMap.get('on'));
        return new Light(id,name,states,data.homeRef.id);
    }
}