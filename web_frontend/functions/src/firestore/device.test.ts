
import * as assert from 'assert';
import { getDevice, FirestoreDevice } from './device';
import * as admin from 'firebase-admin';

function awesome(){
  console.log("hello everyone from test")
  return "21"
}

describe("awesome", ()=>{
  it('should return 21',()=>{
    assert.equal(awesome(),"21")
  })
})

describe("GetDeviceTest", ()=>{

  it('should return matching device object', async function (){
    const serviceAccount = require("/home/kieren/SmartControl/web_frontend/functions/smc-unit-testing-4d6be806760e.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://smc-unit-testing.firebaseio.com",
    });
    const db = admin.firestore() // Init Firestore
    // const deviceRef = db.collection("devices");
    
    const userRef = db.collection('users').doc('HjGMm3dinXuCxNFuzfm6');
    const firestoreDevice = new FirestoreDevice('test light','light',userRef,new Map(Object.entries({brightness: 92 , on: true})))
    const dbDevice = await db.runTransaction(async (t)=>{
      return await getDevice('xCAMyLzbgisor8kxM21W', t);
  })
    assert.equal(dbDevice,firestoreDevice)
  })
})

