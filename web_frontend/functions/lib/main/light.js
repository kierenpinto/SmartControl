"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLightChain = void 0;
const device_1 = require("../firestore/device");
const device_2 = require("../devices/device");
async function updateLightChain(light, transaction) {
    const FSDevice = new device_1.FirestoreDevice(light.name, device_2.DeviceTypes[light.type], light._userRef, new Map(Object.entries(light.states)));
    const prom = device_1.updateDeviceStates(light.id, FSDevice, transaction);
    return prom;
}
exports.updateLightChain = updateLightChain;
//# sourceMappingURL=light.js.map