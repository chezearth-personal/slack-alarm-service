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

    // console.log(new Date());
    await setTimeoutPromise(5000);
    // console.log(new Date());

    try {

      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      dbClient.client = client;
      dbClient.db = client.db(dbName);
      logger.write(`::ffff:127.0.0.1 - - [${(new Date()).toISOString()}] "connected to database ${uri}/${dbName}`)
      return dbClient;

    } catch(e) {


      logger.write(`${errorPrefix} "${e.message}" "${e.status}"
${e.stack}`,"error")
      return Promise.reject(e);

    }

  }

}
