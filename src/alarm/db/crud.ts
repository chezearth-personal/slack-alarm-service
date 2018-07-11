"use strict";

import { Db, DeleteWriteOpResultObject } from "mongodb";

import { mongoDb } from "../server";
import { AlarmDb } from "../../common/types/docs";



export async function getNewAlarms(init: Date): Promise<AlarmDb[]> {

  try {

    const min: number = Math.floor((new Date(init)).valueOf() / 1000) * 1000;
    const minTime: Date = new Date(min);
    const maxTime: Date = new Date(min + 1000);

    // console.log("init:", init, ", min:", minTime, ", max:", maxTime);
    const db: Db = (await mongoDb).db;
    const alarms: AlarmDb[] = await db
      .collection("alarms")
      .find({ alertAt: { "$gte": minTime, "$lt": maxTime } })
      .sort({ alertAt: 1 })
      .toArray();

    return alarms;

  } catch(e) {

    return Promise.reject(e);

  }

}


// Only used for checking data in the tests (not tested)
export async function getMany(col, query, projection, sort): Promise<AlarmDb[]> {

  try {

    const db: Db = (await mongoDb).db;

    const results: AlarmDb[] = await db
      .collection(col)
      .find(query, projection)
      .toArray();

    return results;

  } catch(e) {

    return Promise.reject(e);

  }

}


// Only used for clearing data in the tests (not tested)
export async function deleteAll(col: string): Promise<DeleteWriteOpResultObject["result"]> {

  try {

    const db: Db = (await mongoDb).db;

    const res: DeleteWriteOpResultObject = await db
      .collection(col)
      .deleteMany({})

    return res.result;

  } catch(e) {

    return Promise.reject(e);

  }
}
