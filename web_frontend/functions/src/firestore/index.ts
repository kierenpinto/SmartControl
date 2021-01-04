import { admin } from "../firebase_common";

const db = admin.firestore() // Init Firestore
export {db}
const deviceRef = db.collection("devices");
const usersRef = db.collection("users");
const homeRef = db.collection("homeRef");
export {deviceRef,usersRef,homeRef}