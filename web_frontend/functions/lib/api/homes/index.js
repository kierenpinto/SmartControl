"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
/**
 * Get a home
 * @swagger
 *  /home:
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
        res.json({ method: "GET", message: "Home returned", jwt: token });
    }
    else {
        res.json({ method: "GET", message: "home_id is invalid" });
    }
});
/**
 * Create a home
 * @swagger
 *  /home:
 *    post:
 *      summary: Creates Home specified in the bearer token.
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
router.post("/", function (req, res) {
    const token = req.jwt;
    res.json({ method: "POST", message: "Created a Home", jwt: token });
});
/**
 * Delete a home
 * @swagger
 *  /home/{home_id}:
 *    delete:
 *      summary: Deletes home specified by home_id.
 *      parameters:
 *        - name: home_id
 *          description: The new first name
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
router.delete("/:home_id", function (req, res) {
    const home_id = req.params.home_id;
    if (home_id) {
        try {
            res.json({ method: "DELETE", message: "Deleted a Home", home_id, jwt: req.jwt });
        }
        catch (error) {
            res.status(400).json({ message: "There was an error", error });
        }
    }
    else {
        res.status(400).json({ message: "home_id invalid or non-existent" });
    }
});
/**
 * Edit (Rename) a home
 * @swagger
 *  /home/{home_id}:
 *    put:
 *      summary: Edits (Renames) home specified by home_id.
 *      parameters:
 *        - name: home_id
 *          description: Primary key of home
 *          in: path
 *          required: true
 *          schema:
 *              type: string
 *        - name: name
 *          in: query
 *          description: The name of the home
 *          required: false
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *              description: return modified Home object
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]
 */
router.put("/:home_id", function (req, res) {
    const home_id = req.params.home_id;
    if (home_id) {
        try {
            const name = req.query.name;
            if ((name && typeof (name) !== 'string')) {
                res.status(400).json({ message: "name query params must be of type string" });
                return;
            }
            // Do something here
            res.send({ method: "PUT", message: "Renamed a Home", name, home_id, jwt: req.jwt });
        }
        catch (error) {
            res.status(400).json({ message: "There was an error", error });
        }
    }
    else {
        res.status(400).json({ message: "home_id invalid or non-existent" });
    }
});
/**
 * Add room
 * @swagger
 *  /home/{home_id}/room:
 *    post:
 *      summary: Adds room to home
 *      parameters:
 *        - name: home_id
 *          description: Primary key of home
 *          in: path
 *          required: true
 *          schema:
 *              type: string
 *        - name: name
 *          in: query
 *          description: The name of the home
 *          required: true
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *              description: return modified Home object
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]
 */
router.post("/:home_id/room", function (req, res) {
    const home_id = req.params.home_id;
    if (home_id) {
        try {
            const name = req.query.name;
            if ((name && typeof (name) !== 'string')) {
                res.status(400).json({ message: "name query params must be of type string" });
                return;
            }
            //Do something here
            res.send({ method: "POST", message: "Added a room", name, home_id, jwt: req.jwt });
        }
        catch (error) {
            res.status(400).json({ message: "There was an error", error });
        }
    }
    else {
        res.status(400).json({ message: "home_id invalid or non-existent" });
    }
});
/**
 * Rename room in home
 * @swagger
 *  /home/{home_id}/room/{room_no}:
 *    put:
 *      summary: Rename room in home
 *      parameters:
 *        - name: home_id
 *          description: Primary key of home
 *          in: path
 *          required: true
 *          schema:
 *              type: string
 *        - name: room_no
 *          in: path
 *          description: Room number
 *          required: true
 *          schema:
 *              type: number
 *        - name: name
 *          in: query
 *          description: The new name of the home
 *          required: true
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *              description: return modified Home object
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]
 */
router.put("/:home_id/room/:room_no", function (req, res) {
    const home_id = req.params.home_id;
    const room_no = req.params.room_no;
    if (home_id) {
        try {
            const name = req.query.name;
            if ((name && typeof (name) !== 'string')) {
                res.status(400).json({ message: "name query params must be of type string" });
                return;
            }
            if (!room_no || typeof (room_no) !== 'number') {
                res.status(400).json({ message: "room_no query params must be of type number" });
                return;
            }
            //Do something here
            res.send({ method: "POST", message: "Deleted a room", name, home_id, jwt: req.jwt });
        }
        catch (error) {
            res.status(400).json({ message: "There was an error", error });
        }
    }
    else {
        res.status(400).json({ message: "home_id invalid or non-existent" });
    }
});
/**
 * Delete room in home
 * @swagger
 *  /home/{home_id}/room/{room_no}:
 *    delete:
 *      summary: Deletes room from home
 *      parameters:
 *        - name: home_id
 *          description: Primary key of home
 *          in: path
 *          required: true
 *          schema:
 *              type: string
 *        - name: room_no
 *          in: path
 *          description: Room number
 *          required: true
 *          schema:
 *              type: number
 *      responses:
 *          200:
 *              description: return modified Home object
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]
 */
router.delete("/:home_id/room/:room_no", function (req, res) {
    const home_id = req.params.home_id;
    const room_no = req.params.room_no;
    if (home_id) {
        try {
            if (!room_no || typeof (room_no) !== 'number') {
                res.status(400).json({ message: "room_no query params must be of type number" });
                return;
            }
            //Do something here
            res.send({ method: "POST", message: "Deleted a room", name, home_id, jwt: req.jwt });
        }
        catch (error) {
            res.status(400).json({ message: "There was an error", error });
        }
    }
    else {
        res.status(400).json({ message: "home_id invalid or non-existent" });
    }
});
/**
 * Add member
 * @swagger
 *  /home/{home_id}/room:
 *    post:
 *      summary: Adds member to home
 *      parameters:
 *        - name: home_id
 *          description: Primary key of home
 *          in: path
 *          required: true
 *          schema:
 *              type: string
 *        - name: email
 *          in: query
 *          description: Email address of the member
 *          required: true
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *              description: return modified Home object
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]
 */
router.post("/:home_id/room", function (req, res) {
    const home_id = req.params.home_id;
    const member_email = req.params.email;
    if (home_id) {
        try {
            if ((member_email && typeof (member_email) !== 'string')) {
                res.status(400).json({ message: "member_email query params must be of type string" });
                return;
            }
            //Do something here
            res.send({ method: "POST", message: "Added a room", home_id, jwt: req.jwt });
        }
        catch (error) {
            res.status(400).json({ message: "There was an error", error });
        }
    }
    else {
        res.status(400).json({ message: "home_id invalid or non-existent" });
    }
});
/**
* Delete member from home
* @swagger
*  /home/{home_id}/room/{room_no}:
*    delete:
*      summary: Deletes member from home
*      parameters:
*        - name: home_id
*          description: Primary key of home
*          in: path
*          required: true
*          schema:
*              type: string
*        - name: member_id
*          in: path
*          description: Member ID
*          required: true
*          schema:
*              type: number
*      responses:
*          200:
*              description: return modified Home object
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          items:
*                              type: string
*      security:
*        - BearerAuth:[]
*/
router.delete("/:home_id/member/:member_id", function (req, res) {
    const home_id = req.params.home_id;
    const member_id = req.params.member_id;
    if (home_id) {
        try {
            if (!member_id || typeof (member_id) !== 'string') {
                res.status(400).json({ message: "member_id query params must be of type string" });
                return;
            }
            //Do something here
            res.send({ method: "POST", message: "Deleted a member", name, home_id, jwt: req.jwt });
        }
        catch (error) {
            res.status(400).json({ message: "There was an error", error });
        }
    }
    else {
        res.status(400).json({ message: "home_id invalid or non-existent" });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map