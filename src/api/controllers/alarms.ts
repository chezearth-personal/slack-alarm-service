"use strict";

import * as assert from "assert";
import {
  create,
  getMany,
  getOne
} from "../../common/db/crud";

import { Alarm } from "../../common/types/payloads";
import { AlarmDb } from "../../common/types/docs";
import { myStream } from "../../common/helpers/winston";
import { isUnique, payload2doc, doc2payload } from "../models/alarms";


const errorPrefix: string = `                 - - [${(new Date()).toISOString()}] `


export async function createAlarm(req, res, next): Promise<void> {

  try {

    const reqDoc: AlarmDb = Object.assign({}, payload2doc(req.swagger.params.alarm.value))

    // the 'alertAt' field must be unique (it cannot enter twice), ids are managed by MongoDB
    assert.ok(
      await isUnique({ alertAt: reqDoc.alertAt }),
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

    myStream.write(`${errorPrefix} "${e.message}" "${e.status}"
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

    myStream.write(`${errorPrefix} "${e.message}" "${e.status}"
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

    myStream.write(`${errorPrefix} "${e.message}" "${e.status}"
${e.stack}`,"error")
    res
      .status(404)
      .type("application/json")
      .json(e)
      .end();

  }
}
