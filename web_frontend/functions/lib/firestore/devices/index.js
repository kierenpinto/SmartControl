"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnknownDevice = exports.deviceTransaction = exports.FirestoreDeviceDBAdapter = exports.FirestoreDevice = void 0;
const light_1 = require("./light");
const __1 = require("..");
class FirestoreDevice {
    constructor(name, type, homeRef, states) {
        this.name = name;
        this.type = type;
        this.homeRef = homeRef;
        this.states = states;
    }
}
exports.FirestoreDevice = FirestoreDevice;
class FirestoreDeviceDBAdapter {
    constructor(FirestoreTransaction) {
        this.FirestoreTransaction = FirestoreTransaction;
    }
    async get(device_id) {
        const singleRef = __1.deviceRef.doc(device_id);
        const deviceDoc = await this.FirestoreTransaction.get(singleRef.withConverter(this.FirestoreConverter));
        const deviceData = deviceDoc.data();
        return deviceData;
    }
    update(data) {
        const singleRef = __1.deviceRef.doc(data.id).withConverter(data.converter);
        this.FirestoreTransaction.update(singleRef, data);
        return { id: singleRef.id };
    }
    create(data) {
        const singleRef = __1.deviceRef.doc(data.id).withConverter(data.converter);
        this.FirestoreTransaction.set(singleRef, data);
        return { id: singleRef.id };
    }
    delete(data) {
        if (typeof data === "object") {
            const singleRef = __1.deviceRef.doc(data.id);
            this.FirestoreTransaction.delete(singleRef);
        }
        else if (typeof data === "string") {
            const singleRef = __1.deviceRef.doc(data);
            this.FirestoreTransaction.delete(singleRef);
        }
    }
}
exports.FirestoreDeviceDBAdapter = FirestoreDeviceDBAdapter;
function deviceTransaction(operation) {
    const transaction = __1.db.runTransaction(async (t) => {
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
async function getUnknownDevice(device_id, Transaction) {
    const singleRef = __1.deviceRef.doc(device_id);
    const deviceDoc = await Transaction.get(singleRef.withConverter(FirestoreConverter));
    const deviceData = deviceDoc.data();
    return deviceData;
}
exports.getUnknownDevice = getUnknownDevice;
//# sourceMappingURL=index.js.map