"use strict";

import { Db, DeleteWriteOpResultObject } from "mongodb";

import { mongoConn } from "../server";
import { getDb } from '../../common/db/connector';
import { AlarmDb } from "../../common/types/docs";
import { logger } from "../../common/helpers/winston"


const errorPrefix: string = `                 - - [${(new Date()).toISOString()}] `


export async function getNewAlarms(init: Date): Promise<AlarmDb[]> {

  try {

    const min: number = Math.floor((new Date(init)).valueOf() / 1000) * 1000;
    const minTime: Date = new Date(min);
    const maxTime: Date = new Date(min + 1000);

    // console.log("init:", init, ", min:", minTime, ", max:", maxTime);
    const db: Db = await getDb(mongoConn);
    // const db: Db | undefined = (await mongoDb).db;
    const alarms: AlarmDb[] = await db
      .collection("alarms")
      .find({ alertAt: { "$gte": minTime, "$lt": maxTime } })
      .sort({ alertAt: 1 })
      .toArray();

    return alarms;

  } catch(e) {

    logger.write(`${errorPrefix} "${e.message}" "${e.status}"
${e.stack}`,"error");
    return Promise.reject(e);

  }

}


// Only used for checking data in the tests (not tested)
export async function getMany(col, query, projection, sort): Promise<AlarmDb[]> {

  try {

    // const db: Db = (await mongoDb).db;
    const db: Db = await getDb(mongoConn);

    const results: AlarmDb[] = await db
      .collection(col)
      .find(query)
      .project(projection)
      .sort(sort)
      .toArray();

    return results;

  } catch(e) {

    return Promise.reject(e);

  }

}


// Only used for clearing data in the tests (not tested)
export async function deleteAll(col: string): Promise<DeleteWriteOpResultObject["result"]> {

  try {

    // const db: Db = (await mongoDb).db;
    const db: Db = await getDb(mongoConn);

    const res: DeleteWriteOpResultObject = await db
      .collection(col)
      .deleteMany({})

    return res.result;

  } catch(e) {

    return Promise.reject(e);

  }
}
