"use strict";

import * as winston from "winston";


const options: winston.LoggerOptions = {
  console: {
    level: "info",
    handleExceptions: true,
    json: false,
    colorize: true
  }
};


const logger = new (winston.Logger)({
  exitOnError: false,
  transports: [
    new winston.transports.Console(options)
  ],
});


class MyStream {

  write(text: string): void {
    logger.info(text.trim());
  }

}


export const myStream = new MyStream();
