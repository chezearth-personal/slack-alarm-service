'use strict';

import { Db, MongoClient } from 'mongodb';
import * as util from 'util';
import { logger } from '../helpers/winston'

import { DbConfig } from '../types/types';

export interface DbClient {
  db: Db,
  client: MongoClient
}


export async function getDb(mongoConn: Promise<DbClient | void>): Promise<Db> {

  try {

    const dbClient: void | DbClient = await mongoConn;
    if(!dbClient) throw {
      message: 'No database connection - check MongoDb is running',
      status: 400
    };

    return dbClient.db;

  } catch(e) {

    logger.write(`"${e.message}" "${e.status}"
${e.stack}`,"error");
    return Promise.reject(e);

  }

}


export async function connectDb(uri: string, dbName: string, wait: number): Promise<DbClient> {

  let dbClient: DbClient = { client: null, db: null };
  const setTimeoutPromise = util.promisify(setTimeout);
  while(dbClient.db === null) {

    try {

      await setTimeoutPromise(wait);

      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      dbClient.client = client;
      dbClient.db = client.db(dbName);
      // logger.write(`"connected to database ${uri}/${dbName}`)
      return dbClient;

    } catch(e) {


      // logger.write(`                 ${errorPrefix} "${e.message}" "${e.status}"
// ${e.stack}`,"error")
      return Promise.reject(e);

    }

  }

}


export async function dbConnection(count: number, env: string, dbConfig: DbConfig, serverFunction: () => Promise<any>): Promise<void | DbClient> {

  if(env !== 'test') logger.write(`"Attempt ${count + 1} connecting to database: ${dbConfig.url}" "${env} environment"`);

  try {

    const db: DbClient = await connectDb(dbConfig.url, dbConfig.dbName, dbConfig.wait ? dbConfig.wait : 0);

    if(env !== "test") logger.write(`"Server connected to database: ${dbConfig.url}" "${env} environment"`);

    // Now there is a database connection, we can call SwaggerExpress
    await serverFunction();

    return db;

  } catch(e) {

    if(dbConfig.retries && count + 1 < dbConfig.retries) {
      return await dbConnection(count + 1, env, dbConfig, serverFunction);
    } else {
      logger.write(`"Server failed to connect to database: ${dbConfig.url}" "${env} environment"`, "error");
      process.exit(1);
    }

  }

}
