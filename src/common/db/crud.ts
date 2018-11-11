'use strict';

import {
  Db,
  WriteOpResult,
  DeleteWriteOpResultObject
} from 'mongodb';

import { AlarmDb } from '../../common/types/docs'


// CRUD operations
export async function create(db: Db, col: string, doc: AlarmDb): Promise<AlarmDb> {

  try {

    const res: WriteOpResult = await db
      .collection(col)
      .insertOne(doc);

    return res.ops['0'];

  } catch(e) {

    return Promise.reject(e);

  }

}


export async function getMany(db: Db, col: string, query, projection, sort): Promise<AlarmDb[]> {

  try {

    const results: AlarmDb[] = await db
      .collection(col)
      .find(query, projection)
      .sort(sort)
      .toArray();

    return results;

  } catch(e) {

    return Promise.reject(e);

  }

}


export async function getOne(db: Db, col: string, id: string, otherQueryParams: any, projection: any): Promise<AlarmDb> {

  try {

    const opQuery: any = Object.assign({ _id: id }, otherQueryParams);
    const result: AlarmDb = await db
      .collection(col)
      .findOne(opQuery);

    return result;

  } catch(e) {

    return Promise.reject(e);

  }
}


// Only used to check if data already exists
export async function getCount(db: Db, col: string, query): Promise<number> {

  try {

    const num: number = await db
      .collection(col).find(query).count();

    return num;

  } catch(e) {

    return Promise.reject(e);

  }
}


// Only used for clearing data in the tests (not routed)
export async function deleteAll(db: Db, col: string): Promise<DeleteWriteOpResultObject['result']> {

  try {

    const res: DeleteWriteOpResultObject = await db
      .collection(col)
      .deleteMany({})

    return res.result;

  } catch(e) {

    return Promise.reject(e);

  }
}
