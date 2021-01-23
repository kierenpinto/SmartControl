"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// import { CreateUser } from '../../models/users';
const router = express.Router();
/**
 * Get a user
 * @swagger
 *  /user:
 *    get:
 *      summary: Returns the user specified in the bearer token.
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
router.get("/", function (req, res) {
    const token = req.jwt;
    res.json({ method: "GET", message: "User returned", jwt: token });
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
    // new CreateUser()
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
/**
 * Delete a user
 * @swagger
 *  /user:
 *    delete:
 *      summary: Delete user specified in the bearer token.
 *      responses:
 *          200:
 *              description: return success or fail
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]
 */
router.delete("/", function (req, res) {
    res.send({ method: "Delete", message: "Deleted User", token: req.jwt });
});
exports.default = router;
//# sourceMappingURL=index.js.map