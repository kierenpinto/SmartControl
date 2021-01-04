/* REST API for All Client Connections 
We use a self documenting Swagger REST API.
https://blog.logrocket.com/documenting-your-express-api-with-swagger/
*/

import * as express from 'express';
import * as swaggerJsDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import device from './devices';
import { AuthMiddleWare } from './auth';
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KPinKonnect Express API with Swagger",
      version: "0.0.1",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
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
const specs = swaggerJsDoc(options)
const app = express()
app.use(
  express.urlencoded({
    extended: true,
  }),
  express.json()
);
app.use(AuthMiddleWare)
app.use("/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
)

app.use("/devices", device)

export default app;