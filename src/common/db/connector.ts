'use strict';

import { Db, MongoClient } from 'mongodb';
import * as util from 'util';
import { logger } from '../helpers/winston'

import { DbConfig, DbConnect } from '../types/types';


export async function connectDb(dbConnect: DbConnect): Promise<Db> {
  const setTimeoutPromise = util.promisify(setTimeout);

  try {
    await setTimeoutPromise(dbConnect.wait);
    const client = await MongoClient.connect(dbConnect.url, { useNewUrlParser: true });
    // logger.write(`"connected to database ${uri}/${dbName}`)
    return client.db(dbConnect.dbName);
  } catch(e) {
//       logger.write(`                 ${errorPrefix} "${e.message}" "${e.status}"
// ${e.stack}`,"error")
    return Promise.reject(e);
  }

}


export async function dbConnection(dbConfig: DbConfig): Promise<Db> {

  if(dbConfig.env !== 'test') logger.write(
		`"Attempt ${dbConfig.count + 1} connecting to database: ${dbConfig.url}" "${dbConfig.env} environment"`
	);

  try {
    const dbConnect = {
      url: dbConfig.url,
      dbName: dbConfig.dbName,
      wait: dbConfig.wait ? dbConfig.wait : 0
    };
    const db: Db = await connectDb(dbConnect);

    if(dbConfig.env !== "test") logger.write(`"Server connected to database: ${dbConfig.url}" "${dbConfig.env} environment"`);

    // Now there is a database connection, we can call the server functions that come after the connection is established
    await Promise.all(dbConfig.serverFunctions.map(e => e()));
    return db;
  } catch(e) {

    if(dbConfig.retries && dbConfig.count + 1 < dbConfig.retries) {
      const dbConfigNew: DbConfig = Object.assign({}, dbConfig, {count: dbConfig.count + 1});
			Promise.reject(e);
      return await dbConnection(dbConfigNew);
    } else {
      logger.write(
				`"Server failed to connect to database: ${dbConfig.url}" "${dbConfig.env} environment"`, "error"
			);
			Promise.reject(e);
      process.exit(1);
    }

  }

}
