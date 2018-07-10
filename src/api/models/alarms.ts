"use strict";

import { getCount } from "../../common/db/crud";
import { Alarm } from "../../common/types/payloads"


const buildField = <T>(key: string, value: any, o?: T) => {

  let obj = {};
  obj[key] = value; // makes a new object { key: value }
  return Object.assign({}, o, obj); //makes copy of object

}


export async function isUnique(obj: any): Promise<boolean> {

  try {

    const result: any = await getCount("alarms", obj);
    return result === 0;

  } catch(e) {

    return Promise.reject(e);

  }
}


const string2date = (key: string, value: any) => key === "alertAt"
  ? buildField(key, new Date(value))
  : buildField(key, value);


const date2string = (key: string, value: any) => key === "alertAt"
  ? buildField(key, value.toISOString())
  : buildField(key, value);


export const payload2doc = <T>(payload: T) => Object.keys(payload)
  .reduce((obj, key) => Object.assign(
    obj,
    key === "id"
      ? { _id: payload[key] }
      : string2date(key, payload[key])
  ), {});


export const doc2payload = <T>(payload: T) => Object.keys(payload)
  .reduce((obj, key) => Object.assign(
    obj,
    key === "_id"
      ? { id: payload[key] }
      : date2string(key, payload[key])
  ), {});
