"use strict";

import * as schedule from 'node-schedule';


export class ScheduledItem {

  constructor(alertString: string, cb: Function) {

    const alert: Date = new Date(alertString)
    const year: number = alert.getFullYear();
    const month: number = alert.getMonth();
    const date: number = alert.getDate();
    const hours: number = alert.getHours();
    const mins: number = alert.getMinutes();
    const secs: number = alert.getSeconds();
    schedule.scheduleJob(`${secs} ${mins} ${hours} ${date} ${month} ${year}`, cb)

  }

}
