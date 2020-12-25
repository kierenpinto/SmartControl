"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreDevice = exports.deviceToFirestore = exports.firestoreToDevice = exports.updateDeviceStates = exports.editDevice = exports.getDevice = exports.deviceTransaction = void 0;
/* Import firebase */
const firebase_common_1 = require("../firebase_common");
const light_1 = require("./devices/light");
const db = firebase_common_1.admin.firestore(); // Init Firestore
const deviceRef = db.collection("devices");
class FirestoreDevice {
    constructor(name, type, userRef, states) {
        this.states = states;
        this.name = name;
        this.type = type;
        this.userRef = userRef;
    }
}
exports.FirestoreDevice = FirestoreDevice;
async function getDevice(device_id, Transaction) {
    const singleRef = deviceRef.doc(device_id);
    const deviceDoc = await Transaction.get(singleRef);
    const deviceData = deviceDoc.data();
    return deviceData;
}
exports.getDevice = getDevice;
async function updateDeviceStates(device_id, newData, Transaction) {
    const singleRef = deviceRef.doc(device_id);
    const states = newData.states;
    Transaction.update(singleRef, { states: states });
}
exports.updateDeviceStates = updateDeviceStates;
async function editDevice(device_id, newData, Transaction) {
    const singleRef = deviceRef.doc(device_id);
    Transaction.update(singleRef, newData);
}
exports.editDevice = editDevice;
function deviceTransaction(operation) {
    const transaction = db.runTransaction(async (t) => {
        return await operation(t);
    }).catch(err => console.error(err));
    return transaction;
}
exports.deviceTransaction = deviceTransaction;
function firestoreToDevice(device_id, deviceData) {
    switch (deviceData.type) {
        case "curtains":
        //create curtain device
        case "lights":
            //create light device
            return light_1.FirestoreToLight(device_id, deviceData);
        default:
            // return Promise.reject(Error("Invalid Device Type"))
            return null; // replace with exception
    }
}
exports.firestoreToDevice = firestoreToDevice;
function deviceToFirestore(device) {
    //implement
    throw new Error("Not implemented");
}
exports.deviceToFirestore = deviceToFirestore;
//# sourceMappingURL=device.js.map