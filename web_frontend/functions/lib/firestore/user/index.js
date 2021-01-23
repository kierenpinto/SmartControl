"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreUserDBAdapter = void 0;
const __1 = require("..");
const users_1 = require("../../models/users");
class FirestoreUserDBAdapter {
    constructor(FirestoreTransaction) {
        this.FirestoreTransaction = FirestoreTransaction;
    }
    async get(user_id) {
        const singleRef = __1.usersRef.doc(user_id);
        const deviceDoc = await this.FirestoreTransaction.get(singleRef.withConverter(FirestoreUserConverter));
        const deviceData = deviceDoc.data();
        return deviceData;
    }
    update(data) {
        const singleRef = __1.usersRef.doc(data.id).withConverter(FirestoreUserConverter);
        return this.FirestoreTransaction.update(singleRef, data);
    }
    create(data) {
        const singleRef = __1.usersRef.doc(data.id).withConverter(FirestoreUserConverter);
        return this.FirestoreTransaction.set(singleRef, data);
    }
    delete(data) {
        if (typeof data === "object") {
            const singleRef = __1.usersRef.doc(data.id);
            this.FirestoreTransaction.delete(singleRef);
        }
        else if (typeof data === "string") {
            const singleRef = __1.usersRef.doc(data);
            this.FirestoreTransaction.delete(singleRef);
        }
    }
}
exports.FirestoreUserDBAdapter = FirestoreUserDBAdapter;
const FirestoreUserConverter = {
    toFirestore(user) {
        return { ...user };
    },
    fromFirestore(snapshot) {
        const data = snapshot.data();
        const id = snapshot.id;
        const firstname = typeof data.firstname === 'string' ? data.firstname : 'No firstname';
        const lastname = typeof data.lastname === 'string' ? data.lastname : 'No lastname';
        const home = data.home instanceof Map ? data.home : new Map();
        return new users_1.User(id, firstname, lastname, home);
    }
};
//# sourceMappingURL=index.js.map