"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
/**
 * Get a home
 * @swagger
 *  /user:
 *    get:
 *      summary: Returns the home object specified.
 *      parameters:
 *        - name: home_id
 *          description: The home ID
 *          in: path
 *          required: true
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *              description: return Home object
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]
 */
router.get("/:home_id", function (req, res) {
    const home_id = req.params.home_id;
    if (home_id && typeof (home_id)) {
        const token = req.jwt;
        res.json({ method: "GET", message: "User returned", jwt: token });
    }
    else {
        res.json({ method: "GET", message: "home_id is invalid" });
    }
});
/**
 * Create a user
 * @swagger
 *  /user:
 *    post:
 *      summary: Creates user specified in the bearer token.
 *      responses:
 *          200:
 *              description: return User object
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]
 */
router.post("/", function (req, res) {
    const token = req.jwt;
    res.json({ method: "POST", message: "User returned", jwt: token });
});
/**
 * Edit a user
 * @swagger
 *  /user:
 *    put:
 *      summary: Edit user specified in the bearer token.
 *      parameters:
 *        - name: firstname
 *          description: The new first name
 *          in: query
 *          required: false
 *          schema:
 *              type: string
 *        - name: lastname
 *          in: query
 *          description: The new last name (surname)
 *          required: false
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *              description: return modified User object
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]
 */
router.put("/", function (req, res) {
    const firstname = req.query.firstname;
    const lastname = req.query.lastname;
    if ((firstname && typeof (firstname) !== 'string') || (lastname && typeof (lastname) !== 'string')) {
        res.status(400).json({ message: "firstname or lastname query params must be of type string" });
    }
    res.send({ method: "PUT", message: { firstname, lastname }, token: req.jwt });
});
exports.default = router;
//# sourceMappingURL=index.js.map