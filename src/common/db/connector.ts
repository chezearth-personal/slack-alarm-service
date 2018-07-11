"use strict";

import { Db, MongoClient } from "mongodb";
import { myStream } from "../helpers/winston"

export interface DbClient {
  db: Db,
  client: MongoClient
}

const errorPrefix: string = `                 - - [${(new Date()).toISOString()}] `

export async function connectDb(uri: string, dbName: string): Promise<DbClient> {

  try {

    const client: MongoClient = await MongoClient.connect(uri, { useNewUrlParser: true });
    return {
      client: client,
      db: client.db(dbName)
    };

  } catch(e) {

    myStream.write(`${errorPrefix} "${e.message}" "${e.status}"
${e.stack}`,"error")
    return Promise.reject(e);

  }

}
