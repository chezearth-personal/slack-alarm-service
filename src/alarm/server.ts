"use strict";

import * as config from "config";
import * as schedule from "node-schedule";

import { getNewAlarms } from "./db/crud";
import { postSlack } from "./webhooks/slack";
import { AlarmDb } from "../common/types/docs";

import { logger } from "../common/helpers/winston";
import { connectDb, DbClient } from '../common/db/connector';


const env: string = config.util.getEnv("NODE_ENV") || "development";
const wait: number = Number(config.get("database_connection_wait")) || 6000;
const retries: number = Number(config.get("database_connection_retries")) || 10;
const slack_channel: string = config.get("slack_channel") || "#general";
const slack_username: string = config.get("slack_username") || "webhookbot";


async function schedulerStart(): Promise<void> {

  schedule.scheduleJob(config.get("cron_check_alarms"), async () => {

    try {

      //call controllers/getNewAlarms
      const alarmsToSend: AlarmDb[] = await getNewAlarms(new Date());

      //webhooks/postSlack function
      if(alarmsToSend.length > 0) {

        const res: string[] = await Promise.all(alarmsToSend.map(async (e) => await postSlack(e)));

        if(env !== "test") logger.write(`"sending ${res.length} alarm messag${res.length > 1 ? 'e' : 'es'} with 'alertAt' times: ${alarmsToSend.map(alarm => alarm.alertAt)} to slack from '${slack_username}' on the ${slack_channel} channel" "results: ${res}"`);
      }

    } catch(e) {

      logger.write(`"${e.message}" "${e.status}"
  ${e.stack}`,"error")
    }

  });

}


// Mongo DB connection. Returned as a promise which resolves quite quickly. The promise is awaited each time the connection is used
const url: string = config.get("mongoUrl") || "mongodb://127.0.0.1:27017";
const dbName: string = config.get("database") || "alarmServer";

async function dBconnection(count): Promise<void | DbClient> {

  if(env !== "test") logger.write(`"Attempt ${count + 1} connecting to database" "${env} environment"`);
  return await connectDb(url, dbName, wait)
    .then(db => {

    if(env !== "test") logger.write(`"Server connected to and polling database" "${env} environment"`);
    schedulerStart();
    return db;

    })
    .catch(e => {

      if(count + 1 < retries) return dBconnection(count + 1)
        .then(db => db)
        .catch(e => e);
      else {
        logger.write(`"Server failed to connect to database" "${env} environment"`, "error");
        process.exit(1);
      }

    });
}


export const mongoConn: Promise<void | DbClient> = dBconnection(0);
