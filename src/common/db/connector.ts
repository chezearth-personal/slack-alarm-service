"use strict";

import { Db, MongoClient } from "mongodb";
import * as util from 'util';
import { logger } from "../helpers/winston"

export interface DbClient {
  db: Db,
  client: MongoClient
}


const errorPrefix: string = `                 - - [${(new Date()).toISOString()}] `



export async function connectDb(uri: string, dbName: string): Promise<DbClient> {

  let dbClient: DbClient = { client: null, db: null };
  const setTimeoutPromise = util.promisify(setTimeout);
  while(dbClient.db === null) {

    await setTimeoutPromise(1000, '');

    try {

      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      dbClient.client = client;
      dbClient.db = client.db(dbName);
      return dbClient;

    } catch(e) {


      logger.write(`${errorPrefix} "${e.message}" "${e.status}"
${e.stack}`,"error")
      return Promise.reject(e);

    }

  }

}
