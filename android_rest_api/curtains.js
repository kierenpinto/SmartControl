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

router.use(express.json()) // Add JSON middleware

router.get('/',(req,res)=>{
    curtainsRef.doc('user').get().then(doc => {

        text = doc.data()
        //res.send("Curtains! Camera! Action!")
        res.send(JSON.stringify(text))
    })
})

router.get('/verify', (req,res) => {
  console.log(req.body)
  // request_body = JSON.parse(req.body)
  idToken = req.body.idToken
  admin.auth().verifyIdToken(idToken).then((decodedToken)=>{
    let uid =decodedToken.uid
    admin.auth().getUser(uid).then((record)=>{
      res.send({'name':record.displayName,"uid":uid})
    })
  }
  )
  // res.send(req.body)
})


module.exports = router