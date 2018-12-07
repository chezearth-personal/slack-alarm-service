'use strict';

import * as assert from 'assert';
import * as config from 'config';
import { Db } from 'mongodb';

import {
  create,
  getMany,
  getOne
} from '../../common/db/crud';
import { mongoConn } from '../server';

import { Alarm } from '../../common/types/payloads';
import { AlarmDb } from '../../common/types/docs';
import { logger } from '../../common/helpers/winston';
import { isUnique, payload2doc, doc2payload } from '../helpers/alarms';


const uniqueAlertAt: boolean = config.get('unique_alert_times')

export async function createAlarm(req, res, next): Promise<void> {

  try {

    const reqDoc: AlarmDb = Object.assign({}, payload2doc(req.swagger.params.alarm.value))

    // the 'alertAt' field may be constrained as unique (configurable), ids are managed by MongoDB
    assert.ok(
      !uniqueAlertAt || await isUnique({ alertAt: reqDoc.alertAt }),
      'an alarm with the alert date and time already exists'
    );

    const db: Db = await mongoConn;
    const doc: AlarmDb = await create(db, 'alarms', reqDoc);

    const resPayload: Alarm = doc2payload(doc);
    res
      .status(201)
      .type('application/json')
      .json(resPayload)
      .end()

  } catch(e) {

    logger.write(`"${e.message}" 400
${e.stack}`,"error")
    res
      .status(400)
      .type('application/json')
      .json(Object.assign({ message: e.message }, e))
      .end()

  }

}


export async function getAllAlarms(req, res, next): Promise<void> {

  try {

    const db: Db = await mongoConn;
    const docs: AlarmDb[] = await getMany(
      db,
      'alarms',
      {},
      {},
      {}
    );
    const resPayload: Alarm[] = docs.map(doc => doc2payload(doc));
    res
      .status(200)
      .type('application/json')
      .json(resPayload)
      .end();

  } catch(e) {

    logger.write(`"${e.message}" "${e.status}"
${e.stack}`,"error")
    res
      .status(404)
      .type('application/json')
      .json(e)
      .end();

  }

}


export async function getAlarmDetails(req, res, next): Promise<void> {

  try {

    const db: Db = await mongoConn;
    const doc: AlarmDb = await getOne(
      db,
      'alarms',
      req.swagger.params.id.value,
      {},
      {}
    );
    const resPayload: Alarm = doc2payload(doc);
    res
      .status(200)
      .type('application/json')
      .json(resPayload)
      .end();

  } catch(e) {

    logger.write(`"${e.message}" "${e.status}"
${e.stack}`,"error")
    res
      .status(404)
      .type('application/json')
      .json(e)
      .end();

  }
}
