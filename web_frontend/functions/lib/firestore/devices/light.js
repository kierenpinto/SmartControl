"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightFirestoreConverter = exports.FirestoreLightDBAdapter = void 0;
const _1 = require(".");
const __1 = require("..");
const devices_1 = require("../../models/devices");
const light_1 = require("../../models/devices/light");
const errors_1 = require("./errors");
/*
Holds the light dbtabase adapters and converters for the firestore database.
*/
class FirestoreLightDBAdapter extends _1.FirestoreDeviceDBAdapter {
    constructor() {
        super(...arguments);
        this.FirestoreConverter = exports.LightFirestoreConverter;
    }
}
exports.FirestoreLightDBAdapter = FirestoreLightDBAdapter;
exports.LightFirestoreConverter = {
    toFirestore(light) {
        const states = new Map();
        states.set("brightness", light.states.brightness);
        states.set("on", light.states.on);
        const home = __1.homeRef.doc(light.home);
        return new _1.FirestoreDevice(light.name, devices_1.DeviceTypes.Light, home, states);
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
        // Ensure homeReference exists otherwise error.
        if (!data.homeRef || !(data.homeRef instanceof FirebaseFirestore.DocumentReference)) {
            throw new errors_1.NoDeviceUserError();
        }
        else {
            data.homeRef = data.homeRef;
        }
        // Ensure states are represented in a Map
        let statesMap = data.states;
        if (!(statesMap && statesMap instanceof Map)) {
            statesMap = new Map();
        }
        const states = new light_1.LightStates(statesMap.get('brightness'), statesMap.get('on'));
        return new light_1.default(id, name, states, data.homeRef.id);
    }
};
//# sourceMappingURL=light.js.map