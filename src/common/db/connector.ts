"use strict";

import { Db, MongoClient } from "mongodb";
import * as util from 'util';
import { logger } from "../helpers/winston"

export interface DbClient {
  db: Db,
  client: MongoClient
}


// const errorPrefix: string = `[${(new Date()).toISOString()}] `


export async function getDb(mongoConn: Promise<DbClient | void>): Promise<Db> {

  try {

    const dbClient: void | DbClient = await mongoConn;
    // console.log("dbClient =", dbClient, "test =", !dbClient);
    if(!dbClient) throw {
      message: 'No database connection - check MongoDb is running',
      status: 400
    };

    return dbClient.db;

  } catch(e) {

    logger.write(`"${e.message}" "${e.status}"
${e.stack}`,"error");
    // console.log("ERROR THROWN (connector.ts/getDb()):", e);
    return Promise.reject(e);

  }

}


export async function connectDb(uri: string, dbName: string, delay: number): Promise<DbClient> {

  let dbClient: DbClient = { client: null, db: null };
  const setTimeoutPromise = util.promisify(setTimeout);
  while(dbClient.db === null) {

    try {

      // console.log('STARTING TIMER', new Date());
      await setTimeoutPromise(delay);
      // console.log('STOPPING TIMER', new Date());

      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      dbClient.client = client;
      dbClient.db = client.db(dbName);
      logger.write(`"connected to database ${uri}/${dbName}`)
      return dbClient;

    } catch(e) {


      // logger.write(`                 ${errorPrefix} "${e.message}" "${e.status}"
// ${e.stack}`,"error")
      return Promise.reject(e);

    }

  }

}
