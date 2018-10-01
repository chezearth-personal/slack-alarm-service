"use strict";

import * as winston from "winston";
import { util } from "config";



const options: winston.LoggerOptions = {
  console: {
    level: "info",
    handleExceptions: true,
    json: false,
    colorize: true
    // formatter: opts => `${opts.level}:${opts.level.length} ${" ".repeat(7 - opts.level.length)}::ffff:127.0.0.1 - - ${opts.message}`
  }
};


const logging: winston.LoggerInstance = util.getEnv('NODE_ENV') !== "test"
  ? new (winston.Logger)({
    transports: [
      new winston.transports.Console({
        exitOnError: false,
        json: false,
        timestamp: () => (new Date).toISOString(),
        formatter: opts => `${opts.level}:${" ".repeat(7 - opts.level.length)}::ffff:127.0.0.1 - - [${opts.timestamp()}] ${opts.message}`
      })
    ]
    // exitOnError: false,
    // transports: [
      // new winston.transports.Console(options)
    // ]
  })
  : new (winston.Logger)({
    transports: [
      new winston.transports.File({
        filename: "test.log",
        exitOnError: false,
        json: false,
        timestamp: () => (new Date).toISOString(),
        formatter: opts => `${opts.level}:${" ".repeat(7 - opts.level.length)}::ffff:127.0.0.1 - - ${opts.message}`
      })
    ]
  });


class Stream {

  write(text: string, level?: string): void {
    logging.log(level || "info", text.trim());
  }

  done = (cb) => logging.on("logging", cb);

}


export const logger = new Stream();
