"use strict"

import * as uuidv1 from "uuid/v4";

import { Alarm } from "../../common/types/payloads";


export function findAlarms(): Array<Alarm> {
  return [
    {
      id: uuidv1(),
      name: "Alarm number zero",
      alertAt: new Date((new Date).valueOf() + 60000).toISOString() // add 1 min to now
    },
    {
      id: uuidv1(),
      name: "Alarm number one",
      alertAt: new Date((new Date).valueOf() + 120000).toISOString() // add 2 mins to now
    },
    {
      id: uuidv1(),
      name: "Alarm number two",
      alertAt: new Date((new Date).valueOf() + 180000).toISOString() // add 3 mins to now
    },
    {
      id: uuidv1(),
      name: "Alarm number three",
      alertAt: new Date((new Date).valueOf() + 240000).toISOString() // add 4 mins to now
    },
    {
      id: uuidv1(),
      name: "Alarm number four",
      alertAt: new Date((new Date).valueOf() + 300000).toISOString() // add 5 mins to now
    },
    {
      id: uuidv1(),
      name: "Alarm number five",
      alertAt: new Date((new Date).valueOf() + 360000).toISOString() // add 6 mins to now
    }
  ];
}
