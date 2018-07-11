"use strict";

import * as config from "config";
import * as schedule from "node-schedule";

import { getNewAlarms } from "./db/crud";
import { postSlack } from "./webhooks/slack";
import { connectDb, DbClient } from '../common/db/connector';
import { myStream } from "../common/helpers/winston";
import { AlarmDb } from "../common/types/docs";


const env: string = config.util.getEnv("NODE_ENV");

myStream.write(`::ffff:127.0.0.1 - - [${(new Date()).toISOString()}] "SERVER STARTED and polling database" "${env} environment"`)

schedule.scheduleJob(config.get("cron_check_alarms"), async () => {

  //myStream.write(`::ffff:127.0.0.1 - - [${(new Date()).toISOString()}] "This is the 3-second scheduled item"`);


  //call controllers/getNewAlarms
  const alarmsToSend: AlarmDb[] = await getNewAlarms(new Date());

  console.log("Alarms at this time:", alarmsToSend);

  //webhooks/postSlack function
  if(alarmsToSend.length > 0) {

    const res: string[] = await Promise.all(alarmsToSend.map(async (e) => await postSlack(e.name)));

    myStream.write(`::ffff:127.0.0.1 - - [${(new Date()).toISOString()}] "sending ${res.length} alarm messag${res.length > 1 ? 'e' : 'es'} to slack from '${config.get("slack_username")}' on the ${config.get("slack_channel")} channel" "results: ${res}"`);
  }

});


// Mongo DB connection. Returned as a promise which resolves quite quickly. The promise is awaited each time the connection is used.
const url: string = config.get("mongoUrl") || "mongodb://127.0.0.1:27017";
const dbName: string = config.get("database") || "alarmServer";
export const mongoDb: Promise<DbClient> = connectDb(url, dbName);
