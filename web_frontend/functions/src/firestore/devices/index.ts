
/* Import firebase */
import { DatabaseAdapter } from '../../models';
import { Device, DeviceTypes } from '../../models/devices';
import { LightFirestoreConverter } from './light';
import {deviceRef,db} from '..'

export class FirestoreDevice {
    constructor(public name?: string,public type?:DeviceTypes,public homeRef?:FirebaseFirestore.DocumentReference,public states?:Map<string,any>){}
}

abstract class FirestoreDeviceDBAdapter<D extends Device<any>> implements DatabaseAdapter{
    constructor(public FirestoreTransaction:FirebaseFirestore.Transaction){}
    abstract FirestoreConverter:FirebaseFirestore.FirestoreDataConverter<D>
    async get(device_id:string) {
        const singleRef = deviceRef.doc(device_id)
        const deviceDoc = await this.FirestoreTransaction.get(singleRef.withConverter(this.FirestoreConverter));
        const deviceData = deviceDoc.data();
        return deviceData;
    }
    update(data: D){
        const singleRef = deviceRef.doc(data.id).withConverter(data.converter)
        this.FirestoreTransaction.update(singleRef,data);
        return {id:singleRef.id}
    }
    create(data: D){
        const singleRef = deviceRef.doc(data.id).withConverter(data.converter)
        this.FirestoreTransaction.set(singleRef,data);
        return {id:singleRef.id}
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

export function deviceTransaction(operation:deviceTransactionFunction){
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

export async function getUnknownDevice(device_id:string, Transaction:FirebaseFirestore.Transaction){
    const singleRef = deviceRef.doc(device_id)
    const deviceDoc = await Transaction.get(singleRef.withConverter(FirestoreConverter));
    const deviceData = deviceDoc.data();
    return deviceData;
}


/** Legacy */
// async function getDevice(device_id:string,Transaction:FirebaseFirestore.Transaction){
//     const singleRef = deviceRef.doc(device_id)
//     const deviceDoc = await Transaction.get(singleRef.withConverter(FirestoreConverter));
//     const deviceData = deviceDoc.data();
//     return deviceData;
// }

// async function updateDeviceStates(device_id:string,newData:FirestoreDevice,Transaction:FirebaseFirestore.Transaction){
//     const singleRef = deviceRef.doc(device_id)
//     const states = newData.states;
//     Transaction.update(singleRef,{states:states});
// }

// async function editDevice(device_id:string,newData:FirestoreDevice,Transaction:FirebaseFirestore.Transaction){
//     const singleRef = deviceRef.doc(device_id);
//     Transaction.update(singleRef,newData);
// }

// export {editDevice,updateDeviceStates, getDevice}

type FirestoreDeviceList = "light" | "curtain";
export {FirestoreDeviceList}