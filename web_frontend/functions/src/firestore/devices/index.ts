
/* Import firebase */
import {admin} from '../../firebase_common';
import { DatabaseAdapter } from '../../models';
import { Device, DeviceTypes } from '../../models/devices';
import { LightFirestoreConverter } from './light';
const db = admin.firestore() // Init Firestore
const deviceRef = db.collection("devices");
const usersRef = db.collection("users");
export {deviceRef}
export {usersRef};

class FirestoreDevice {
    constructor(public name?: string,public type?:DeviceTypes,public userRef?:FirebaseFirestore.DocumentReference,public states?:Map<string,any>){}
}

class FirestoreDeviceDBAdapter<D extends Device<any>> implements DatabaseAdapter{
    constructor(public FirestoreTransaction:FirebaseFirestore.Transaction){}
    async get(device_id:string) {
        const singleRef = deviceRef.doc(device_id)
        const deviceDoc = await this.FirestoreTransaction.get(singleRef.withConverter(FirestoreConverter));
        const deviceData = deviceDoc.data();
        return deviceData;
    }
    update(data: D){
        const singleRef = deviceRef.doc(data.id).withConverter(data.converter)
        return this.FirestoreTransaction.update(singleRef,data);
    }
    create(data: D){
        const singleRef = deviceRef.doc(data.id).withConverter(data.converter)
        return this.FirestoreTransaction.set(singleRef,data);
    }
    delete(data: D|string):void{
        if (typeof data === "object"){
            const singleRef = deviceRef.doc(data.id)
            this.FirestoreTransaction.delete(singleRef);
        }
        else if(typeof data === "string"){
            const singleRef = deviceRef.doc(data)
            this.FirestoreTransaction.delete(singleRef)
        }
    }
}
export {FirestoreDeviceDBAdapter}

interface deviceTransactionFunction extends Function{
    (t:FirebaseFirestore.Transaction):Promise<boolean> //success
}

function deviceTransaction(operation:deviceTransactionFunction){
    const transaction  = db.runTransaction(async (t)=>{
        return await operation(t)
    }).catch(err=>console.error(err))
    return transaction;
}

const FirestoreConverter = {
    toFirestore(_device:any): FirebaseFirestore.DocumentData {
        throw new Error ('FirestoreConverter should not be used to set a document')
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot){
        const data = <FirestoreDevice> snapshot.data(); // Assume that it is of shape FirestoreDevice
        if (!data.type){
            throw new Error(`Device has no type`);
        }
        switch (data.type) {
            case "curtain":
                //create curtain device
                
            case "light":
                //create light device
                return LightFirestoreConverter.fromFirestore(snapshot)
                
            default:
                throw new Error('Device has no type' );
        } 
    }
}

export {deviceTransaction,FirestoreDevice}


/** Legacy */
async function getDevice(device_id:string,Transaction:FirebaseFirestore.Transaction){
    const singleRef = deviceRef.doc(device_id)
    const deviceDoc = await Transaction.get(singleRef.withConverter(FirestoreConverter));
    const deviceData = deviceDoc.data();
    return deviceData;
}

async function updateDeviceStates(device_id:string,newData:FirestoreDevice,Transaction:FirebaseFirestore.Transaction){
    const singleRef = deviceRef.doc(device_id)
    const states = newData.states;
    Transaction.update(singleRef,{states:states});
}

async function editDevice(device_id:string,newData:FirestoreDevice,Transaction:FirebaseFirestore.Transaction){
    const singleRef = deviceRef.doc(device_id);
    Transaction.update(singleRef,newData);
}

export {editDevice,updateDeviceStates, getDevice}

type FirestoreDeviceList = "light" | "curtain";
export {FirestoreDeviceList}