"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightFirestoreConverter = void 0;
const _1 = require(".");
const devices_1 = require("../../models/devices");
const light_1 = require("../../models/devices/light");
/*
Holds the light models for the firestore database.
*/
class NoDeviceUserError extends Error {
    constructor() {
        super();
        this.name = 'NoDeviceUserError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoDeviceUserError);
        }
        this.message = "There was no user assignmed to this device. This is a critical failure!";
    }
}
const LightFirestoreConverter = {
    toFirestore(light) {
        const states = new Map();
        states.set("brightness", light.states.brightness);
        states.set("on", light.states.on);
        const userRef = _1.usersRef.doc(light.user);
        return new _1.FirestoreDevice(light.name, devices_1.DeviceTypes.Light, userRef, states);
    },
    fromFirestore(snapshot) {
        const id = snapshot.id;
        const data = snapshot.data(); // Assume that it is of shape FirestoreDevice
        if (data.type !== 'light') {
            throw new Error(`A device of type ${data.type} cannot be converted with LightFirestoreConverter`);
        }
        //Ensure name is a string and exists
        if (!data.name) {
            data.name = 'Unnamed Light';
        }
        const name = String(data.name);
        // Ensure userReference exists otherwise error.
        if (!data.userRef || !(data.userRef instanceof FirebaseFirestore.DocumentReference)) {
            throw new NoDeviceUserError();
        }
        else {
            data.userRef = data.userRef;
        }
        // Ensure states are represented in a Map
        let statesMap = data.states;
        if (!(statesMap && statesMap instanceof Map)) {
            statesMap = new Map();
        }
        const states = new light_1.LightStates(statesMap.get('brightness'), statesMap.get('on'));
        return new light_1.default(id, name, states, data.userRef.id);
    }
};
exports.LightFirestoreConverter = LightFirestoreConverter;
//# sourceMappingURL=light.js.map