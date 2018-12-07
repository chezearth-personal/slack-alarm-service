'use strict';

import * as winston from 'winston';
import { util } from 'config';


function msgParser(msg: string, timestamp: string): string {
  return msg.substring(0, 6) === 'MORGAN'
    ? msg.substring(6)
    : `::ffff:127.0.0.1 - - [${timestamp}] ${msg}`;
}

/*
const options: winston.LoggerOptions = {
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};
*/

const logging: winston.LoggerInstance = util.getEnv('NODE_ENV') !== 'test'
  ? new (winston.Logger)({
    transports: [
      new winston.transports.Console({
        exitOnError: false,
        json: false,
        timestamp: () => (new Date).toISOString(),
        formatter: options => `${options.level}:${" ".repeat(7 - options.level.length)}${msgParser(options.message, options.timestamp())}`
      })
    ]
  })
  : new (winston.Logger)({
    transports: [
      new winston.transports.File({
        filename: 'test.log',
        exitOnError: false,
        json: false,
        timestamp: () => (new Date).toISOString(),
        formatter: options => `${options.level}:${" ".repeat(7 - options.level.length)}${msgParser(options.message, options.timestamp())}`
      })
    ]
  });


class Stream {

  write(text: string, level?: string): void {
    logging.log(level || 'info', text.trim());
  }

  done = (cb) => logging.on('logging', cb);

}


export const logger = new Stream();
