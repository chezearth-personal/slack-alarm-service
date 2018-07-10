"use strict";

import {
  create,
  getMany,
  getOne
} from "../../common/db/crud";

import { Alarm } from "../../common/types/payloads";
import { myStream } from "../../common/helpers/winston";


const errorLog: string = `                 - - [${(new Date()).toISOString()}] `

/*
function fixDateTime(date_time: string) {
  return date_time.indexOf('T') === 10 && date_time.indexOf('Z') === date_time.length - 1
  ? date_time
  : (
      date_time.substring(0, date_time.indexOf(' '))
      + 'T'
      + date_time.substring(date_time.indexOf(' ') + 1, date_time.length)
      + 'Z'
    )
}
*/

export async function createAlarm(req, res, next): Promise<void> {

  try {

    const value = Object.assign({}, req.swagger.params.alarm.value)

    console.log('Alarm being POSTed:')
    console.log(req.swagger.params);
    const doc: Alarm = await create("alarms", value);
    // console.log("Document returned by the DB:", doc);
    res
      .status(201)
      .type("application/json")
      .json(doc)
      .end()

  } catch(e) {

    myStream.write(`${errorLog} "${e.message}" "${e.status}"
${e.stack}`,"error")
    res
      .status(404)
      .type("application/json")
      .json(e)
      .end()

  }

}


export async function getAllAlarms(req, res, next): Promise<void> {

  try {

    const docs: Alarm[] = await getMany(
      "alarms",
      {},
      {},
      {}
    );
    res
      .status(200)
      .type("application/json")
      .json(docs)
      .end();

  } catch(e) {

    myStream.write(`${errorLog} "${e.message}" "${e.status}"
${e.stack}`,"error")
    res
      .status(404)
      .type("application/json")
      .json(e)
      .end();

  }

}


export async function getAlarmDetails(req, res, next): Promise<void> {

  try {

    const doc: Alarm = await getOne(
      "alarms",
      req.swagger.params.id.value,
      {},
      {}
    );
    res
      .status(200)
      .type("application/json")
      .json(doc)
      .end();

  } catch(e) {

    myStream.write(`${errorLog} "${e.message}" "${e.status}"
${e.stack}`,"error")
    res
      .status(404)
      .type("application/json")
      .json(e)
      .end();

  }
}
