'use strict';

import * as express from 'express';
import * as SwaggerExpress from 'swagger-express-mw';



const app: express.Application = express();

const appRoot = __dirname.substring(0, __dirname.indexOf("dist"));
const swaggerConfig: SwaggerExpress.Config = {
  appRoot: appRoot  // required config
};

SwaggerExpress.create(swaggerConfig, function(err, swaggerExpress) {

  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  const port: string | number = process.env.PORT || 3000;
  app.listen(port);


  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});


export default app; // for testing
