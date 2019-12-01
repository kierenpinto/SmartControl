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
/* function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];

  return oktaJwtVerifier.verifyAccessToken(accessToken,'api://default')
    .then((jwt) => {
      req.jwt = jwt;
      return next();
    })
    .catch((err) => {
      res.status(401).send(err);
    });
} */

const app = express();

app.use(cors({ origin: true }));
/* app.use((cors()));
app.get('/noauth', (req, res) => {
  return res.json({
    message: 'Hello!  There\'s not much to see here :) Please grab one of our front-end samples for use with this sample resource server'
  });
});
app.get('/', authenticationRequired, (req, res) => {
  return res.json(req.jwt.claims);
}); */

app.get('/', (req, res) =>{
    const authHeader = req.headers.authorization || ''; // Set the authorization header or '' if not present
    const match = authHeader.match(/Bearer (.+)/); // Match to Bearer token expression 'Bearer ' + AccessToken
    if (!match) { // If there isn't a match then return 401 error
      return res.status(401).end();
    }
    const accessToken = match[1];
    const expectedAudience = 'api://default';
    console.log("accessToken",accessToken);
    return oktaJwtVerifier.verifyAccessToken(accessToken, expectedAudience).then((jwt) => {
      console.log("JWT HERE: ", jwt)
      return new Promise((resolve,reject)=>{
        let claims = jwt.claims
        console.log("Claims HERE",claims);
        resolve(res.json(claims))
      })
      }).catch((err) => {
        res.status(401).send(err);
      });
})


module.exports = app