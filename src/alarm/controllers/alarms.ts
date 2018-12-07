'use strict';

import { Db, DeleteWriteOpResultObject } from 'mongodb';

import { mongoConn } from '../server';
import { getMany, deleteAll } from '../../common/db/crud';
import { AlarmDb } from '../../common/types/docs';
import { logger } from '../../common/helpers/winston'


export async function getNewAlarms(init: Date): Promise<AlarmDb[]> {

  try {

    const min: number = Math.floor((new Date(init)).valueOf() / 1000) * 1000;
    const minTime: Date = new Date(min);
    const maxTime: Date = new Date(min + 1000);

    const db: Db = await mongoConn;
    const alarms: AlarmDb[] = await getMany(
      db,
      'alarms',
      { alertAt: { '$gte': minTime, '$lt': maxTime } },
      {},
      { alertAt: 1 }
    );

    return alarms;

  } catch(e) {

    logger.write(`"${e.message}" "${e.status}"
${e.stack}`,"error");
    return Promise.reject(e);

  }

}


// Only used for checking data in the tests (not tested)
// export async function getMany(col, query, projection, sort): Promise<AlarmDb[]> {
//
//   try {
//
//     const db: Db = await getDb(mongoConn);
//
//     const results: AlarmDb[] = await db
//       .collection(col)
//       .find(query)
//       .project(projection)
//       .sort(sort)
//       .toArray();
//
//     return results;
//
//   } catch(e) {
//
//     return Promise.reject(e);
//
//   }
//
// }


// Only used for clearing data in the tests (not tested)
export async function removeAll(col: string): Promise<DeleteWriteOpResultObject['result']> {

  try {

    const db: Db = await mongoConn;

    const res: DeleteWriteOpResultObject['result'] = await deleteAll(
      db,
      col
    );

    return res;

  } catch(e) {

    return Promise.reject(e);

  }
}
