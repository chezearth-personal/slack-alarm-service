"use strict";

import * as schedule from "node-schedule";

import { ScheduledItem } from "./helpers/Scheduler";
import { myStream } from "../common/helpers/winston";


new schedule.scheduleJob('*/3 * * * * *', () => {

  myStream.write("info", `::ffff:127.0.0.1 - - [${(new Date()).toISOString()}] "This is the 3-second scheduled item"`);

});
