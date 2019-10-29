const express = require('express')
const router = express.Router()


/* Import firebase */
const admin = require("firebase-admin");
const functions = require('firebase-functions');

// Init admin SDK
// admin.initializeApp(functions.config().firebase);
// let config = functions.config().firebase
// if (functions.config().firebase){
//     config = functions.config().firebase
// }else{
    // config = process.env.GOOGLE_APPLICATION_CREDENTIALS
// }
admin.initializeApp();

let db = admin.firestore() // Init Firestore

const curtainsRef = db.collection('curtains')

//router.use(express.json()) // Add JSON middleware

router.get('/', (req, res) => {
    curtainsRef.doc('user').get().then(doc => {
        text = doc.data()
        //res.send("Curtains! Camera! Action!")
        res.send(JSON.stringify(text))
        return
    }).catch(err=>console.error(err))
})

router.all('/test/',(req,res)=>{
    if (req.method === "POST"){
        if (req.rawBody){
            res.send(req.rawBody)
        }else{
            res.send("no body")
        }
    }else if (req.method === "GET"){
        if (req.rawBody){
            res.send(req.rawBody)
        }else{
            res.send("no body")
        }
    }

})

router.all('/verify/', (req, res) => {
    if (req.body){
    let idToken = JSON.parse(req.body).idToken
    let uid = admin.auth().verifyIdToken(idToken).then((decodedToken) => {
        let uid = decodedToken.uid
        return admin.auth().getUser(uid) //returns promise of user
    }).catch(err=>{console.error(err); res.send(err)})
    uid.then((record) => {
        res.send({ 'name': record.displayName, "uid": uid })
        return
    }).catch(err=>{console.error(err); res.send(err)})
    }else{    
        res.send("No JSON HERE")
    }
})


module.exports = router
