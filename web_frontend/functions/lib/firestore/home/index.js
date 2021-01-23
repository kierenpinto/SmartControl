"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreHomeDBAdapter = void 0;
const __1 = require("..");
const home_1 = require("../../models/home");
class FirestoreHomeDBAdapter {
    constructor(FirestoreTransaction) {
        this.FirestoreTransaction = FirestoreTransaction;
    }
    async get(home_id) {
        const singleRef = __1.homeRef.doc(home_id);
        const deviceDoc = await this.FirestoreTransaction.get(singleRef.withConverter(FirestoreUserConverter));
        const deviceData = deviceDoc.data();
        return deviceData;
    }
    update(data) {
        const singleRef = __1.homeRef.doc(data.id).withConverter(FirestoreUserConverter);
        return this.FirestoreTransaction.update(singleRef, data);
    }
    create(data) {
        const singleRef = __1.homeRef.doc().withConverter(FirestoreUserConverter);
        this.FirestoreTransaction.set(singleRef, data);
        return singleRef.id;
    }
    delete(data) {
        if (typeof data === "object") {
            const singleRef = __1.homeRef.doc(data.id);
            this.FirestoreTransaction.delete(singleRef);
        }
        else if (typeof data === "string") {
            const singleRef = __1.homeRef.doc(data);
            this.FirestoreTransaction.delete(singleRef);
        }
    }
}
exports.FirestoreHomeDBAdapter = FirestoreHomeDBAdapter;
const FirestoreUserConverter = {
    toFirestore(home) {
        const rooms = home.rooms.map(room => {
            if (room) {
                const newRoom = new Map();
                newRoom.set('name', room.name);
                newRoom.set('devices', room.devices);
                return newRoom;
            }
            else {
                return null;
            }
        });
        const members = new Map();
        home.members.forEach((member, id) => {
            const newMem = new Map([['name', member.name], ['admin', member.admin]]);
            members.set(id, newMem);
        });
        return {
            ...home,
            rooms,
            members
        };
    },
    fromFirestore(snapshot) {
        const data = snapshot.data();
        const uid = snapshot.id;
        const name = typeof data.name === 'string' ? data.name : 'Unnamed Room';
        const rooms = data.rooms instanceof Array ? data.rooms : [];
        const newRooms = rooms.map(room => {
            if (room instanceof Map) {
                const name_map = typeof (room.get('name')) === "string" ? String(room.get('name')) : 'unnamed room';
                const dev = room.get('devices') instanceof Map ? room.get('devices') : new Map();
                return {
                    name: name_map,
                    devices: dev
                };
            }
            else {
                return null;
            }
        });
        const members = data.members instanceof Map ? data.members : new Map();
        const newMembers = new Map();
        members.forEach((member, member_id) => {
            const mem = {
                name: member.get('name') ? member.get('name') : 'no_name',
                admin: member.get('admin') ? member.get('admin') : false
            };
            newMembers.set(member_id, mem);
        });
        return new home_1.Home(uid, name, newRooms, newMembers);
    }
};
//# sourceMappingURL=index.js.map