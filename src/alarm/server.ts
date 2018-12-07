'use strict';

import * as config from 'config';
import * as schedule from 'node-schedule';
import { Db } from 'mongodb';

import { getNewAlarms } from './controllers/alarms';
import { postSlack } from './webhooks/slack';
import { AlarmDb } from '../common/types/docs';

import { logger } from '../common/helpers/winston';
import { dbConnection } from '../common/db/connector';

import { SlackWebHook, SlackBody } from './types/slack';
import { DbConfig } from '../common/types/types';


const env: string = config.util.getEnv('NODE_ENV') || 'development';
const slack: SlackWebHook = {
  channel: process.env.SLACK_CHANNEL
    || config.get('slack_channel').toString()
    || '#general',
  userName: config.get('slack_username') || 'webhookbot'
}

/*
 * Scheduler. Runs the function at the appointed times (every
 * second).
 *
 */
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


/*
 * Mongo DB config and connection. Config contains a reference to
 * any functions above as well as important parameters for
 * establishing the connection. Returned as a promise which gets
 * passed to controllers can only be used there once resolved.
 *
 */
const dbConfig: DbConfig = {
  count: 0,
  env: env,
  url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
  dbName: config.get('database').toString() || 'alarmServer',
  wait: Number(config.get('database_connection_wait')) || 6000,
  retries: Number(config.get('database_connection_retries')) || 10,
  serverFunctions: [ schedulerStart ]
}

export const mongoConn: Promise<Db> = dbConnection(dbConfig);
