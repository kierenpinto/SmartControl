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
                url: "kptechreviews.ml",
                email: "kieren.pinto@hotmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000/books",
            },
        ],
    },
    apis: ["./devices"],
};
const specs = swaggerJsDoc(options);
const app = express();
app.use(express.urlencoded({
    extended: true,
}), express.json());
app.use(auth_1.AuthMiddleWare);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/devices", devices_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map