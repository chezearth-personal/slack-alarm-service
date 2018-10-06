"use strict";

import * as assert from "assert";
import * as config from "config";

import {
  create,
  getMany,
  getOne
} from "../db/crud";

import { Alarm } from "../../common/types/payloads";
import { AlarmDb } from "../../common/types/docs";
import { logger } from "../../common/helpers/winston";
import { isUnique, payload2doc, doc2payload } from "../models/alarms";


// const errorPrefix: string = `                 - - [${(new Date()).toISOString()}] `
const uniqueAlertAt: boolean = config.get("unique_alert_times")

export async function createAlarm(req, res, next): Promise<void> {

  try {

    const reqDoc: AlarmDb = Object.assign({}, payload2doc(req.swagger.params.alarm.value))

    // the 'alertAt' field may be constrained as unique (configurable), ids are managed by MongoDB
    assert.ok(
      !uniqueAlertAt || await isUnique({ alertAt: reqDoc.alertAt }),
      "an alarm with the alert date and time already exists"
    );


    const doc: AlarmDb = await create("alarms", reqDoc);

    const resPayload: Alarm = doc2payload(doc);
    res
      .status(201)
      .type("application/json")
      .json(resPayload)
      .end()

  } catch(e) {

    logger.write(`"${e.message}" 400
${e.stack}`,"error")
    res
      .status(400)
      .type("application/json")
      .json(Object.assign({ message: e.message }, e))
      .end()

  }

}


export async function getAllAlarms(req, res, next): Promise<void> {

  try {

    const docs: AlarmDb[] = await getMany(
      "alarms",
      {},
      {},
      {}
    );
    const resPayload: Alarm[] = docs.map(doc => doc2payload(doc));
    res
      .status(200)
      .type("application/json")
      .json(resPayload)
      .end();

  } catch(e) {

    logger.write(`"${e.message}" "${e.status}"
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

    const doc: AlarmDb = await getOne(
      "alarms",
      req.swagger.params.id.value,
      {},
      {}
    );
    const resPayload: Alarm = doc2payload(doc);
    res
      .status(200)
      .type("application/json")
      .json(resPayload)
      .end();

  } catch(e) {

    logger.write(`"${e.message}" "${e.status}"
${e.stack}`,"error")
    res
      .status(404)
      .type("application/json")
      .json(e)
      .end();

  }
}
