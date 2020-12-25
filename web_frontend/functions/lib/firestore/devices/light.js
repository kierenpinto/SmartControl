"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightToFirestore = exports.FirestoreToLight = void 0;
const device_1 = require("../device");
const light_1 = require("../../devices/light");
function FirestoreToLight(id, FSDevice) {
    if (FSDevice.type !== 'lights') {
        throw new Error("A device that is not a light has been converted");
    }
    const states = new light_1.LightStates(FSDevice.states.get('brightness'), FSDevice.states.get('on'));
    const light = new light_1.default(id, FSDevice.name, states, FSDevice.userRef.id, FSDevice.userRef);
    return light;
}
exports.FirestoreToLight = FirestoreToLight;
function LightToFirestore(light) {
    const states = new Map();
    states.set("brightness", light.states.brightness);
    states.set("on", light.states.on);
    return new device_1.FirestoreDevice(light.name, "lights", light._userRef, states);
}
exports.LightToFirestore = LightToFirestore;
//# sourceMappingURL=light.js.map