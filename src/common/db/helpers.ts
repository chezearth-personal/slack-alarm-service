'use strict';

import { Db, ObjectID } from 'mongodb';

import { getOne } from './crud';


const buildField = <T>(key: string, value: any, o?: T) => {

  let obj = {};
  obj[key] = value; // makes a new object { key: value }
  return Object.assign({}, o, obj); //makes copy of object

}


export async function documentExists(col: string, id: string): Promise<boolean> {

  try {

    const result: any = await getOne(col, id, {}, {});
    return result !== null;

  } catch(e) {

    return Promise.reject(e);

  }
}


export const toUnderscoreId = <T>(payload: T) => Object.keys(payload)
  .reduce((obj, key) => Object.assign(
    obj,
    key === 'id'
      ? { _id: payload[key] }
      : buildField(key, payload[key])
  ), {});


export const toId = <T>(payload: T) => Object.keys(payload)
  .reduce((obj, key) => Object.assign(
    obj,
    key === '_id'
      ? { id: payload[key] }
      : buildField(key, payload[key])
  ), {});
