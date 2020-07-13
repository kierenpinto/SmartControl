"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Requires
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const OktaJwtVerifier = require("@okta/jwt-verifier");
const bodyParser = require("body-parser");
// Set up the okta verifier - verifies incoming 
const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-496306.okta.com/oauth2/default',
    clientId: '0oa1wdt4ccM1ijs5c357',
    assertClaims: {
        aud: 'api://default'
    }
});
const app = express();
// Setup Cors Middleware
const corsOptions = {
    origin: true
};
const corsMiddleware = cors(corsOptions);
app.use(corsMiddleware);
/**
 * Handle an Authorization Request from the React Web Client that has authenticated on Okta.
 * Generates a custom Firebase auth token for the client to authenticate with.
 */
app.get('/', async (req, res) => {
    const authHeader = req.headers.authorization || ''; // Set the authorization header or '' if not present
    const match = authHeader.match(/Bearer (.+)/); // Match to Bearer token expression 'Bearer ' + AccessToken
    if (!match) { // If there isn't a match then return 401 error
        res.status(401).end();
    }
    else {
        const accessToken = match[1];
        const expectedAudience = 'api://default';
        // For this to work on Google Cloud Functions - cannot be on FREE FB Plan.
        try {
            const jwt = await oktaJwtVerifier.verifyAccessToken(accessToken, expectedAudience);
            const claims = jwt.claims;
            const okta_uid = claims.uid;
            const token = await admin.auth().createCustomToken(okta_uid);
            const payload = { "claims": claims, "firebaseAuthToken": token };
            res.status(200).json(payload);
        }
        catch (err) {
            res.status(401).send(err);
        }
    }
});
const bodyParseApp = express();
bodyParseApp.use('/*', app);
bodyParseApp.use(bodyParser.json());
bodyParseApp.use(bodyParser.urlencoded({ extended: false }));
exports.default = bodyParseApp;
//# sourceMappingURL=react_client.js.map