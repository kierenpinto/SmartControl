import * as express from 'express';
const router = express.Router();

/**
 * Get a known device
 * @swagger
 *  /device/{device_type}:
 *    get:
 *      summary: Returns a device object of known {device_type}
 *      parameters:
 *        - name: device_id
 *          in: query
 *          required: true
 *          schema:
 *              type: string
 *        - name: device_type
 *          in: path
 *          description: The type of device being used
 *          required: false
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *              description: return Device object
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]                  
 */
router.get("/:device_type", function (req, res) {
    if (req.params.device_type && typeof (req.params.device_type) === "string") {
        const device_type = String(req.params.device)
        switch (device_type.toLowerCase()) {
            case "light":
                console.log("light")
                res.send("You've got a light")
                break;
            case "curtain":
                console.log("You've got a curtain")
                break;
            default:
                res.send("Invalid Device Chosen")
                break;
        }
    } else {
        throw new Error("Device Type is not a string")
    }
})

/**
 * Create a known device
 * @swagger
 *  /device/{device_type}:
 *    post:
 *      summary: Creates a device of known {device_type}
 *      parameters:
 *        - name: device_id
 *          in: query
 *          required: true
 *          schema:
 *              type: string
 *        - name: device_type
 *          in: path
 *          description: The type of device being used
 *          required: false
 *          schema:
 *              type: string
 *        - name: home_id
 *          in: query
 *          description: The home ID of the device
 *          required: true
 *          schema:
 *              type: string
 *        - name: room_no
 *          in: query
 *          description: The room number of the device
 *          required: true
 *          schema:
 *              type: number
 *      responses:
 *          200:
 *              description: return Device object
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: string
 *      security:
 *        - BearerAuth:[]                  
 */
router.post("/:device_type", function (req, res) {
    if (req.params.device_type && typeof (req.params.device_type) === "string") {
        const device_type = String(req.params.device)
        switch (device_type.toLowerCase()) {
            case "light":
                console.log("light")
                res.send("You've got a light")
                break;
            case "curtain":
                console.log("You've got a curtain")
                break;
            default:
                res.send("Invalid Device Chosen")
                break;
        }
    } else {
        throw new Error("Device Type is not a string")
    }
})

/**
 * Get an unknown device
 * @swagger
 *  /device:
 *    get:
 *      summary: Returns a device object that is unknown
 *      parameters:
 *        - name: device_id
 *          in: query
 *          required: true
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *              description: return Device object
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
    res.status(200).json({ 'hi': req.rawHeaders, 'jwt': JSON.stringify(req.headers.authorization), 'decoded': req.jwt })
})

export default router