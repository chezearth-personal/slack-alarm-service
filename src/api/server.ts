"use strict";

import * as config from "config";
import * as express from "express";
import * as morgan from "morgan";
import * as SwaggerExpress from "swagger-express-mw";

import { logger } from "../common/helpers/winston";

import { connectDb, DbClient } from '../common/db/connector';


// Node environment
const env: string = config.util.getEnv("NODE_ENV");


const app: express.Application = express();


const appRoot = __dirname.substring(0, __dirname.indexOf("dist") - 1);
const swaggerConfig: SwaggerExpress.Config = {
  appRoot: appRoot  // required config
};


// Mongo DB connection. Returned as a promise which resolves quite quickly. The promise is awaited each time the connection is used.
const url: string = config.get("mongoUrl") || "mongodb://127.0.0.1:27017";
const dbName: string = config.get("database") || "alarmServer";

logger.write(`"Attempting to connect to database" "${env} environment"`);

export const mongoConn: Promise<void | DbClient> = connectDb(url, dbName)
  .then(db => {
    logger.write(`"SERVER STARTED and connected to database" "${env} environment"`)

    // Now there is a database connection, we can start the server...
    SwaggerExpress.create(swaggerConfig, function(err, swaggerExpress) {

      if (err) { throw err; }


      // unless in test env, use morgan to log requests
      if(env !== "test") {
        app.use(morgan(`:remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time[digits]ms` , { stream: logger }));
      }


      // install middleware
      swaggerExpress.register(app);


      // start listening
      const port: string | number = config.util.getEnv("PORT") || 3000;
      app.listen(port);


      // Start up message
      if(env !== "test") logger.write(`[${(new Date()).toISOString()}] "SERVER STARTED and listening on localhost:${port}" "${env} environment"`);

    });

    return db;

  })
  .catch(e => {

    logger.write(`"Server failed to connect to database" "${env} environment"`, "error");
    process.exit(1);

  });


export default app; // for testing
