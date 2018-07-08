"use strict";

import { ScheduledItem } from "./helpers/Scheduler";
import * as schedule from "node-schedule";



new schedule.scheduleJob('*/3 * * * * *', () => {

  console.log('This is the 3-second scheduled item');
  
});
