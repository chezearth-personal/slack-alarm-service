"use strict";

import { util, get } from "config";
import * as express from "express";
import * as morgan from "morgan";
import * as SwaggerExpress from "swagger-express-mw";

import { myStream } from "../common/helpers/winston";


// Node environment
const env: string = util.getEnv("NODE_ENV");


const app: express.Application = express();


const appRoot = __dirname.substring(0, __dirname.indexOf("dist") - 1);

const swaggerConfig: SwaggerExpress.Config = {
  appRoot: appRoot  // required config
};

SwaggerExpress.create(swaggerConfig, function(err, swaggerExpress) {

  if (err) { throw err; }


  // unless in test env, use morgan to log requests
  if(env !== "test") {
    app.use(morgan(`:remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"` , { stream: myStream }));
  }


  // install middleware
  swaggerExpress.register(app);


  // start listening
  const port: string | number = get('port') || 3000;
  app.listen(port);


  // Start up message
  if(env !== "test") myStream.write(`::ffff:127.0.0.1 - - [${(new Date()).toISOString()}] "SERVER STARTED and listening on localhost:${port}" "${env} environment"`);

});

export default app; // for testing
