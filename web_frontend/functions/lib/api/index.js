"use strict";
/* REST API for All Client Connections
We use a self documenting Swagger REST API.
https://blog.logrocket.com/documenting-your-express-api-with-swagger/
*/
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const devices_1 = require("./devices");
const users_1 = require("./users");
const auth_1 = require("./auth");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "KPinKonnect Express API with Swagger",
            version: "0.0.1",
            description: "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Kieren Pinto",
                url: "https://kptechreview.ml",
                email: "kieren.pinto@hotmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000/api",
                description: "Main API server"
            },
        ],
        "components": {
            "securitySchemes": {
                "BearerAuth": {
                    "type": "http",
                    "scheme": "Bearer",
                    "in": "header"
                }
            }
        },
    },
    apis: ["./devices/*.js", "./users/*.js", "./homes/*.js"],
};
const specs = swaggerJsDoc(options);
const app = express();
// Setup API Router
const api = express.Router();
api.use(auth_1.AuthMiddleWare);
api.use("/device", devices_1.default);
api.use("/user", users_1.default);
// Include Middleware for url and json parsing.
app.use(express.urlencoded({
    extended: true,
}), express.json());
// Include API Router
app.use("/api", api);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(api));
app.get("/", (_, res) => {
    res.json(specs);
    // res.send("hello word")
});
app.listen(3000, () => { console.log("Server is running"); });
exports.default = app;
//# sourceMappingURL=index.js.map