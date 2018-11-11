'use strict';

import * as config from 'config';
import * as schedule from 'node-schedule';
// import { DbClient } from 'mongodb';

import { getNewAlarms } from './db/crud';
import { postSlack } from './webhooks/slack';
import { AlarmDb } from '../common/types/docs';
import { SlackWebHook, SlackBody } from './types/slack';

import { logger } from '../common/helpers/winston';
import { dbConnection, DbClient } from '../common/db/connector';

import { DbConfig } from '../common/types/types';


const env: string = config.util.getEnv('NODE_ENV') || 'development';
const slack: SlackWebHook = {
  channel: process.env.SLACK_CHANNEL
    || config.get('slack_channel')
    || '#general',
  userName: config.get('slack_username') || 'webhookbot'
}


async function schedulerStart(): Promise<void> {

  schedule.scheduleJob(config.get('cron_check_alarms').toString(), async () => {

    try {

      // call db/crud/getNewAlarms
      const alarmsToSend: AlarmDb[] = await getNewAlarms(new Date());

      // webhooks/slack/postSlack function
      if(alarmsToSend.length > 0) {

        const res: string[] = await Promise.all(
          alarmsToSend.map(async alarm => await postSlack(Object.assign(
              slack,
              { text: alarm.name },
              { icon_emoji: alarm.iconEmoji ? alarm.iconEmoji : config.get('slack_icon_emoji').toString() }
            ))
          )
        );

        if(env !== 'test') logger.write(`"sending ${res.length} alarm messag${res.length > 1 ? 'e' : 'es'} with 'alertAt' times: ${alarmsToSend.map(alarm => alarm.alertAt)} to slack from '${slack.userName}' on the ${slack.channel} channel" "results: ${res}"`);
      }

    } catch(e) {

      logger.write(`"${e.message}" "${e.status}"
  ${e.stack}`,"error")
    }

  });

}


// Mongo DB connection. Returned as a promise which resolves quite quickly. The promise is awaited each time the connection is used

// async function dBconnection(count): Promise<void | DbClient> {
//
//   const url: string = process.env.MONGO_URL
//     || 'mongodb://127.0.0.1:27017';
//   const dbName: string = config.get('database')
//     || 'alarmServer';
//
//   const wait: number = Number(config.get('database_connection_wait'))
//     || 6000;
//   const retries: number = Number(config.get('database_connection_retries'))
//     || 10;
//
//   if(env !== 'test') logger.write(`"Attempt ${count + 1} connecting to database: ${url}" "${env} environment"`);
//   try {
//
//     const db: DbClient = await connectDb(url, dbName, wait);
//     if(env !== 'test') logger.write(`"Server connected to database ${url} and hooked to Slack channel ${slack.channel}" "${env} environment"`);
//
//     schedulerStart();
//     return db;
//
//   } catch(e) {
//
//     if(count + 1 < retries) {
//       return await dBconnection(count + 1);
//     } else {
//       logger.write(`"Server failed to connect to database: ${url}" "${env} environment"`, "error");
//       process.exit(1);
//     }
//
//   }
// }

// Mongo DB connection. Returned as a promise which resolves quite quickly but is awaited if the connection is used.
const dbConfig: DbConfig = {
  url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
  dbName: config.get('database').toString() || 'alarmServer',
  wait: Number(config.get('database_connection_wait')) || 6000,
  retries: Number(config.get('database_connection_retries')) || 10
}

export const mongoConn: Promise<void | DbClient> = dbConnection(0, env, dbConfig, schedulerStart);
