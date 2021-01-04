import { homeRef } from '..';
import { DatabaseAdapter } from '../../models';
import { Home } from '../../models/home';
class FirestoreUserDBAdapter implements DatabaseAdapter{
    constructor(public FirestoreTransaction:FirebaseFirestore.Transaction){}
    async get(user_id:string) {
        const singleRef = homeRef.doc(user_id)
        const deviceDoc = await this.FirestoreTransaction.get(singleRef.withConverter(FirestoreUserConverter));
        const deviceData = deviceDoc.data();
        return deviceData;
    }
    update(data: Home){
        const singleRef = homeRef.doc(data.id).withConverter(FirestoreUserConverter)
        return this.FirestoreTransaction.update(singleRef,data);
    }
    create(data: Home){
        const singleRef = homeRef.doc(data.id).withConverter(FirestoreUserConverter)
        return this.FirestoreTransaction.set(singleRef,data);
    }
    delete(data: Home|string):void{
        if (typeof data === "object"){
            const singleRef = homeRef.doc(data.id)
            this.FirestoreTransaction.delete(singleRef);
        }
        else if(typeof data === "string"){
            const singleRef = homeRef.doc(data)
            this.FirestoreTransaction.delete(singleRef)
        }
    }
}
export {FirestoreUserDBAdapter}


const FirestoreUserConverter = {
    toFirestore(home:Home): FirebaseFirestore.DocumentData {
        const rooms = home.rooms.map(room=> {
            if(room){
                const newRoom = new Map()
                newRoom.set('name', room.name)
                newRoom.set('devices', room.devices)
                return newRoom;
            } else {
                return null;
            }
        })
        const members = new Map();
        home.members.forEach((member,id)=>{
            const newMem = new Map<string,any>([['name',member.name],['admin',member.admin]])
            members.set(id,newMem)
        })
        return {
            ...home,
            rooms,
            members
        }
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot){
        const data = snapshot.data();
        const id = snapshot.id;
        const name = typeof data.name === 'string' ? data.name: 'Unnamed Room'
        const rooms = 
        const home: Map<string,string> = data.home instanceof Map ? data.home : new Map();
        return new Home(id,name,rooms,members)
    }
}