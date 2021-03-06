// Requires
const admin = require("firebase-admin");
const db = admin.firestore() // Init Firestore
const express = require('express');
const cors = require('cors');
const usersRef = db.collection('users');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-496306.okta.com/oauth2/default',
  clientId: '0oa1wdt4ccM1ijs5c357',
  assertClaims: {
    aud: 'api://default'
  }
});

const router = express.Router();

router.use(cors({ origin: true }));
router.get('/',(req,res)=>{
  return res.send("Client Root")
})
router.get('/verify', (req, res) =>{
    const authHeader = req.headers.authorization || ''; // Set the authorization header or '' if not present
    const match = authHeader.match(/Bearer (.+)/); // Match to Bearer token expression 'Bearer ' + AccessToken
    if (!match) { // If there isn't a match then return 401 error
      return res.status(401).end();
    }
    const accessToken = match[1];
    const expectedAudience = 'api://default';
    console.log("accessToken",accessToken);
    return oktaJwtVerifier.verifyAccessToken(accessToken, expectedAudience).then((jwt) => {
        const claims = jwt.claims; //define claims
        const okta_uid = claims.uid
        admin.auth().createCustomToken(okta_uid).then((token)=>{
          const payload = {...claims, "firebaseAuthToken":token}
          return res.json(payload)
        })
      }).catch((err) => {
        res.status(401).send(err);
      });
})


module.exports = router