"use strict";

import * as config from "config";
import { expect } from "chai";
import {
  Db,
  ObjectID,
  WriteOpResult,
  DeleteWriteOpResultObject
} from "mongodb";

import { documentExists, payload2doc, doc2payload } from "./helpers";
import { connectDb, DbClient } from "./connector";
import { Alarm } from "../types/payloads"
//import { mongoDb } from '../server';



// Mongo DB connection. Returned as a promise which resolves quite quickly. The promise is awaited each time the connection is used.
const url: string = config.get("mongoUrl") || "mongodb://127.0.0.1:27017";
const dbName: string = config.get("database") || "alarmServer";
export const mongoDb: Promise<DbClient> = connectDb(url, dbName);


// CRUD operations
export async function create(col: string, doc: Alarm): Promise<Alarm> {

  try {

    expect(await documentExists(col, doc.id), "a document with the supplied UUID already exists").to.be.false; // makes sure we don't already have an alarm with the UUID
    const db: Db = (await mongoDb).db;
    const res: WriteOpResult = await db
      .collection(col)
      .insertOne(payload2doc(doc));

    return doc2payload(res.ops["0"]);

  } catch(e) {

    return Promise.reject(e);

  }

}


export async function getMany(col, query, projection, sort) {

  try {

    const db: Db = (await mongoDb).db;

    const results: any[] = await db
      .collection(col)
      .find(query, projection)
      .toArray();

    return results.map(e => doc2payload(e));

  } catch(e) {

    return Promise.reject(e);

  }

}


export async function getOne(col, id: string, otherQueryParams: any, projection: any) {

  try {

    const db: Db = (await mongoDb).db;

    const opQuery = Object.assign({ _id: id }, otherQueryParams);
    const result: any = await db
      .collection(col)
      .findOne(opQuery);

    return result === null ? result : doc2payload(result);

  } catch(e) {

    return Promise.reject(e);

  }
}


// Only used for clearing data in the tests (not routed)
export async function deleteAll(col: string) {

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
