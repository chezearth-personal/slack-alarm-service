"use strict";

import * as config from "config";
import * as express from "express";
import * as morgan from "morgan";
import * as SwaggerExpress from "swagger-express-mw";

import { myStream } from "../common/helpers/winston";



const app: express.Application = express();

const appRoot = __dirname.substring(0, __dirname.indexOf("dist"));
const swaggerConfig: SwaggerExpress.Config = {
  appRoot: appRoot  // required config
};

SwaggerExpress.create(swaggerConfig, function(err, swaggerExpress) {

  if (err) { throw err; }

  // unless in test env, use morgan to log requests
  if(config.util.getEnv("NODE_ENV") !== "test") {
    app.use(morgan(`:remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"` , { stream: myStream }));
  }


  // install middleware
  swaggerExpress.register(app);

  const port: string | number = process.env.PORT || 3000;
  app.listen(port);


  if(config.util.getEnv("NODE_ENV") !== "test") myStream.write(`::ffff:127.0.0.1 - - [${(new Date()).toISOString()}] "SERVER STARTED and listening on localhost:${port}" "${config.util.getEnv("NODE_ENV")} environment"`);

});


export default app; // for testing
