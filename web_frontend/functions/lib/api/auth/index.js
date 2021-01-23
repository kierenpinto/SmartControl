"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleWare = void 0;
/**
 * Authentication middleware for API
 */
const OktaJwtVerifier = require("@okta/jwt-verifier");
// Set up the okta verifier - verifies incoming 
const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-496306.okta.com/oauth2/default',
    clientId: '0oa1wdt4ccM1ijs5c357',
});
const AuthMiddleWare = async function (req, res, next) {
    const authHeader = req.headers.authorization || ''; // Set the authorization header or '' if not present
    const match = authHeader.match(/Bearer (.+)/); // Match to Bearer token expression 'Bearer ' + AccessToken
    if (!match) { // If there isn't a match then return 401 error
        res.status(401).json({ 'message': 'There is no bearer token' });
    }
    else {
        const accessToken = match[1];
        const expectedAudience = 'api://default';
        // For this to work on Google Cloud Functions - cannot be on FREE FB Plan.
        try {
            const jwt = await oktaJwtVerifier.verifyAccessToken(accessToken, expectedAudience);
            // const jwt = await oktaJwtVerifier.verifyIdToken(accessToken,'0oa1wdt4ccM1ijs5c357')
            console.log("Authenticated JWT: ", jwt);
            req.jwt = jwt;
            next();
        }
        catch {
            req.jwt = false;
            console.log("The token has expired: ", accessToken);
            res.status(401).json({ 'message': `The token '${accessToken}' has expired` });
        }
    }
};
exports.AuthMiddleWare = AuthMiddleWare;
//# sourceMappingURL=index.js.map