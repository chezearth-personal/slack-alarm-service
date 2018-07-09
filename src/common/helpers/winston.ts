"use strict";

import * as winston from "winston";
import { util } from "config";



const options: winston.LoggerOptions = {
  console: {
    level: "info",
    handleExceptions: true,
    json: false,
    colorize: true
  }
};


const logger: winston.LoggerInstance = util.getEnv('NODE_ENV') !== "test"
  ? new (winston.Logger)({
    exitOnError: false,
    transports: [
      new winston.transports.Console(options)
    ]
  })
  : new (winston.Logger)({
    transports: [
      new winston.transports.File({
        filename: "test.log",
        exitOnError: false,
        json: false,
        timestamp: () => (new Date).toISOString,
        formatter: opts => `${opts.level}: ::ffff:127.0.0.1 - - ${opts.message}`,
      })
    ]
  });


class MyStream {

  write(text: string, level?: string): void {
    logger.log(level || "info", text.trim());
  }

  done = (cb) => logger.on("logging", cb);

}


export const myStream = new MyStream();
