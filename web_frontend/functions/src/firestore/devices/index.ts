
/* Import firebase */
import {admin} from '../../firebase_common';
import { LightFirestoreConverter } from './light';
const db = admin.firestore() // Init Firestore
const deviceRef = db.collection("devices");
const usersRef = db.collection("users");

export {usersRef};

type FirestoreDeviceList = "light" | "curtain";

class FirestoreDevice {
    constructor(public name?: string,public type?:FirestoreDeviceList,public userRef?:FirebaseFirestore.DocumentReference,public states?:Map<string,any>){}
}
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

export {FirestoreDeviceList,deviceTransaction,getDevice,editDevice,updateDeviceStates, firestoreToDevice,FirestoreDevice}