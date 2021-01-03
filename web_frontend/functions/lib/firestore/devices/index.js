"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevice = exports.updateDeviceStates = exports.editDevice = exports.FirestoreDevice = exports.deviceTransaction = exports.FirestoreDeviceDBAdapter = exports.usersRef = exports.deviceRef = void 0;
/* Import firebase */
const firebase_common_1 = require("../../firebase_common");
const light_1 = require("./light");
const db = firebase_common_1.admin.firestore(); // Init Firestore
const deviceRef = db.collection("devices");
exports.deviceRef = deviceRef;
const usersRef = db.collection("users");
exports.usersRef = usersRef;
class FirestoreDevice {
    constructor(name, type, userRef, states) {
        this.name = name;
        this.type = type;
        this.userRef = userRef;
        this.states = states;
    }
}
exports.FirestoreDevice = FirestoreDevice;
class FirestoreDeviceDBAdapter {
    constructor(FirestoreTransaction) {
        this.FirestoreTransaction = FirestoreTransaction;
    }
    async get(device_id) {
        const singleRef = deviceRef.doc(device_id);
        const deviceDoc = await this.FirestoreTransaction.get(singleRef.withConverter(FirestoreConverter));
        const deviceData = deviceDoc.data();
        return deviceData;
    }
    update(data) {
        const singleRef = deviceRef.doc(data.id).withConverter(data.converter);
        return this.FirestoreTransaction.update(singleRef, data);
    }
    create(data) {
        const singleRef = deviceRef.doc(data.id).withConverter(data.converter);
        return this.FirestoreTransaction.set(singleRef, data);
    }
    delete(data) {
        if (typeof data === "object") {
            const singleRef = deviceRef.doc(data.id);
            this.FirestoreTransaction.delete(singleRef);
        }
        else if (typeof data === "string") {
            const singleRef = deviceRef.doc(data);
            this.FirestoreTransaction.delete(singleRef);
        }
    }
}
exports.FirestoreDeviceDBAdapter = FirestoreDeviceDBAdapter;
function deviceTransaction(operation) {
    const transaction = db.runTransaction(async (t) => {
        return await operation(t);
    }).catch(err => console.error(err));
    return transaction;
}
exports.deviceTransaction = deviceTransaction;
const FirestoreConverter = {
    toFirestore(_device) {
        throw new Error('FirestoreConverter should not be used to set a document');
    },
    fromFirestore(snapshot) {
        const data = snapshot.data(); // Assume that it is of shape FirestoreDevice
        if (!data.type) {
            throw new Error(`Device has no type`);
        }
        switch (data.type) {
            case "curtain":
            //create curtain device
            case "light":
                //create light device
                return light_1.LightFirestoreConverter.fromFirestore(snapshot);
            default:
                throw new Error('Device has no type');
        }
    }
};
/** Legacy */
async function getDevice(device_id, Transaction) {
    const singleRef = deviceRef.doc(device_id);
    const deviceDoc = await Transaction.get(singleRef.withConverter(FirestoreConverter));
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
//# sourceMappingURL=index.js.map