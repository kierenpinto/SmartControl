
/* Import firebase */
import * as admin from 'firebase-admin'
import { FirestoreToLight } from './devices/light';
import { Device } from '../devices/device';
const db = admin.firestore() // Init Firestore
const deviceRef = db.collection("devices");
// const usersRef = db.collection("users");

type FirestoreDeviceList = "lights" | "curtains";

class FirestoreDevice {
    name:string
    type:FirestoreDeviceList
    userRef:FirebaseFirestore.DocumentReference
    states:Map<string,any>
    constructor(name: string,type:string,userRef:FirebaseFirestore.DocumentReference,states:Map<string,any>){
        this.states = states;
        this.name = name;
        this.type = <FirestoreDeviceList> type;
        this.userRef = userRef;
    }
}
async function getDevice(device_id:string,Transaction:FirebaseFirestore.Transaction){
    const singleRef = deviceRef.doc(device_id)
    const deviceDoc = await Transaction.get(singleRef);
    const deviceData = <FirestoreDevice> deviceDoc.data();
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

function firestoreToDevice(device_id:string,deviceData:FirestoreDevice){
    switch(deviceData.type){
        case "curtains":
            //create curtain device
            
        case "lights":
            //create light device
            return FirestoreToLight(device_id,deviceData)
            
        default:
            // return Promise.reject(Error("Invalid Device Type"))
            return null; // replace with exception
    }
}

function deviceToFirestore(device:Device<any>):FirestoreDevice{
    //implement
    throw new Error("Not implemented");
}

export {FirestoreDeviceList,deviceTransaction,getDevice,editDevice,updateDeviceStates, firestoreToDevice, deviceToFirestore,FirestoreDevice}