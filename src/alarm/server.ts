'use strict';

import * as config from 'config';
import * as schedule from 'node-schedule';
// import { DbClient } from 'mongodb';

import { getNewAlarms } from './db/crud';
import { postSlack } from './webhooks/slack';
import { AlarmDb } from '../common/types/docs';
import { SlackWebHook, SlackBody } from './types/slack';

import { logger } from '../common/helpers/winston';
import { connectDb, DbClient } from '../common/db/connector';


const env: string = config.util.getEnv('NODE_ENV') || 'development';
const slack: SlackWebHook = {
  channel: process.env.SLACK_CHANNEL
    || config.get('slack_channel')
    || '#general',
  userName: config.get('slack_username') || 'webhookbot'
}


async function schedulerStart(): Promise<void> {

  schedule.scheduleJob(config.get('cron_check_alarms'), async () => {

    try {

      //call controllers/getNewAlarms
      const alarmsToSend: AlarmDb[] = await getNewAlarms(new Date());

      //webhooks/postSlack function
      if(alarmsToSend.length > 0) {

        const res: string[] = await Promise.all(
          alarmsToSend.map(async alarm => {
            const defaultIconEmoji: string = config.get('slack_icon_emoji');
            return await postSlack(Object.assign(
              slack,
              { text: alarm.name },
              { icon_emoji: alarm.iconEmoji ? alarm.iconEmoji : defaultIconEmoji }
            ))
          })
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

async function dBconnection(count): Promise<void | DbClient> {

  const url: string = process.env.MONGO_URL
    || 'mongodb://127.0.0.1:27017';
  const dbName: string = config.get('database')
    || 'alarmServer';

  const wait: number = Number(config.get('database_connection_wait'))
    || 6000;
  const retries: number = Number(config.get('database_connection_retries'))
    || 10;

  if(env !== 'test') logger.write(`"Attempt ${count + 1} connecting to database: ${url}" "${env} environment"`);
  try {

    const db: DbClient = await connectDb(url, dbName, wait);
    if(env !== 'test') logger.write(`"Server connected to database ${url} and hooked to Slack channel ${slack.channel}" "${env} environment"`);

    schedulerStart();
    return db;

  } catch(e) {

    if(count + 1 < retries) {
      return await dBconnection(count + 1);
    } else {
      logger.write(`"Server failed to connect to database: ${url}" "${env} environment"`, "error");
      process.exit(1);
    }

  }
}


export const mongoConn: Promise<void | DbClient> = dBconnection(0);
