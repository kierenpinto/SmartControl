const express = require('express')
const router = express.Router()


/* Import firebase */
const admin = require("firebase-admin");
const serviceAccount = require("./firebase_admin_key.json");

// Init admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://studio3test-c22f4.firebaseio.com"
});

let db = admin.firestore() // Init Firestore

const curtainsRef = db.collection('curtains')

router.get('/',(req,res)=>{
    curtainsRef.doc('user').get().then(doc => {

        text = doc.data()
        //res.send("Curtains! Camera! Action!")
        res.send(JSON.stringify(text))
    })
})


module.exports = router