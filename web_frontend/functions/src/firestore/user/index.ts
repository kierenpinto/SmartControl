import { usersRef } from '..';
import { DatabaseAdapter } from '../../models';
import { User } from '../../models/users';
class FirestoreUserDBAdapter implements DatabaseAdapter{
    constructor(public FirestoreTransaction:FirebaseFirestore.Transaction){}
    async get(user_id:string) {
        const singleRef = usersRef.doc(user_id)
        const deviceDoc = await this.FirestoreTransaction.get(singleRef.withConverter(FirestoreUserConverter));
        const deviceData = deviceDoc.data();
        return deviceData;
    }
    update(data: User){
        const singleRef = usersRef.doc(data.id).withConverter(FirestoreUserConverter)
        return this.FirestoreTransaction.update(singleRef,data);
    }
    create(data: User){
        const singleRef = usersRef.doc(data.id).withConverter(FirestoreUserConverter)
        return this.FirestoreTransaction.set(singleRef,data);
    }
    delete(data: User|string):void{
        if (typeof data === "object"){
            const singleRef = usersRef.doc(data.id)
            this.FirestoreTransaction.delete(singleRef);
        }
        else if(typeof data === "string"){
            const singleRef = usersRef.doc(data)
            this.FirestoreTransaction.delete(singleRef)
        }
    }
}
export {FirestoreUserDBAdapter}


const FirestoreUserConverter = {
    toFirestore(user:User): FirebaseFirestore.DocumentData {
        return {...user}
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot){
        const data = snapshot.data();
        const id = snapshot.id;
        const firstname = typeof data.firstname === 'string' ? data.firstname: 'No firstname'
        const lastname = typeof data.lastname === 'string' ? data.lastname: 'No lastname'
        const home: Map<string,string> = data.home instanceof Map ? data.home : new Map();
        return new User(id,firstname,lastname,home)
    }
}