import { homeRef } from '..';
import { DatabaseAdapter } from '../../models';
import { Home, Member } from '../../models/home';
class FirestoreHomeDBAdapter implements DatabaseAdapter {
    constructor(public FirestoreTransaction: FirebaseFirestore.Transaction) { }
    async get(home_id: string) {
        const singleRef = homeRef.doc(home_id)
        const deviceDoc = await this.FirestoreTransaction.get(singleRef.withConverter(FirestoreUserConverter));
        const deviceData = deviceDoc.data();
        return deviceData;
    }
    update(data: Home) {
        const singleRef = homeRef.doc(data.id).withConverter(FirestoreUserConverter)
        return this.FirestoreTransaction.update(singleRef, data);
    }
    create(data: Home) {
        const singleRef = homeRef.doc().withConverter(FirestoreUserConverter)
        this.FirestoreTransaction.set(singleRef, data)
        return singleRef.id;
    }
    delete(data: Home | string): void {
        if (typeof data === "object") {
            const singleRef = homeRef.doc(data.id)
            this.FirestoreTransaction.delete(singleRef);
        }
        else if (typeof data === "string") {
            const singleRef = homeRef.doc(data)
            this.FirestoreTransaction.delete(singleRef)
        }
    }
}
export { FirestoreHomeDBAdapter }


const FirestoreUserConverter = {
    toFirestore(home: Home): FirebaseFirestore.DocumentData {
        const rooms = home.rooms.map(room => {
            if (room) {
                const newRoom = new Map()
                newRoom.set('name', room.name)
                newRoom.set('devices', room.devices)
                return newRoom;
            } else {
                return null;
            }
        })
        const members = new Map();
        home.members.forEach((member, id) => {
            const newMem = new Map<string, any>([['name', member.name], ['admin', member.admin]])
            members.set(id, newMem)
        })
        return {
            ...home,
            rooms,
            members
        }
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
        const data = snapshot.data();
        const uid = snapshot.id;
        const name = typeof data.name === 'string' ? data.name : 'Unnamed Room'
        const rooms:Map<string,any>[] = data.rooms instanceof Array ? data.rooms : [];
        const newRooms = rooms.map(room => {
            if (room instanceof Map) { 
                const name_map = typeof (room.get('name')) === "string" ? String(room.get('name')) : 'unnamed room';
                const dev = room.get('devices') instanceof Map ? <Map<string,string>>room.get('devices') : new Map<string,string>();
                return {
                    name:name_map,
                    devices: dev
                }
            } else {
                return null;
            }
        })
        const members = data.members instanceof Map ? data.members : new Map();
        const newMembers = new Map<string, Member>();
        members.forEach((member, member_id) => {
            const mem: Member = {
                name: member.get('name') ? member.get('name') : 'no_name',
                admin: member.get('admin') ? member.get('admin') : false
            }
            newMembers.set(member_id, mem)
        })
        return new Home(uid, name, newRooms, newMembers)
    }
}