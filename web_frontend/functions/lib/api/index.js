"use strict";
/* REST API for All Client Connections
We use a self documenting Swagger REST API.
https://blog.logrocket.com/documenting-your-express-api-with-swagger/
*/
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
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
    apis: ["./routes/books.js"],
};
const specs = swaggerJsDoc(options);
const app = express();
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
exports.default = app;
//# sourceMappingURL=index.js.map