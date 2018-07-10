"use strict";

import * as schedule from "node-schedule";

import { ScheduledItem } from "./scheduler/Scheduler";
import { myStream } from "../common/helpers/winston";


schedule.scheduleJob('*/3 * * * * *', () => {

  myStream.write(`::ffff:127.0.0.1 - - [${(new Date()).toISOString()}] "This is the 3-second scheduled item"`);
  //call controllers/getNewAlarms
  //for each alarm, create new helpers/scheduler with webhook functionCb
  //webhooks/postSlack function

});
