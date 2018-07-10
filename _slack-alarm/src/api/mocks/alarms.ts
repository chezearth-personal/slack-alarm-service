"use strict";

import * as uuidv1 from "uuid/v4";

import { Alarm } from "../../common/types/payloads";

export function findAlarms(): Array<Alarm> {
  return [
    {
      id: "d4e42fb6-83b1-11e8-aebc-93aba0950376",
      name: "Alarm number zero",
      alertAt: "2018-07-09T19:56:21.655Z"
    },
    {
      id: "16a0ad58-83b2-11e8-8c80-07bd957ab3e7",
      name: "Alarm number one",
      alertAt: "2018-07-09T19:57:22.489Z"
    },
    {
      id: "3811fc76-83b2-11e8-8bd7-8faec1b2a598",
      name: "Alarm number two",
      alertAt: "2018-07-09T19:58:43.742Z"
    },
    {
      id: "63206aa6-83b2-11e8-b4f1-3f12081e3629",
      name: "Alarm number three",
      alertAt: "2018-07-09T19:59:31.322Z"
    },
    {
      id: "92d39dcc-83b2-11e8-a18a-0f97748517ef",
      name: "Alarm number four",
      alertAt: "2018-07-09T19:59:31.673Z"
    },
    {
      id: "995c34e2-83b2-11e8-a148-cbb635f8c127",
      name: "Alarm number five",
      alertAt: "2018-07-10T20:15:45.034Z"
    },
    {
      id: uuidv1(),
      name: "Alarm number six",
      alertAt: new Date((new Date()).valueOf() + 120000).toISOString() // add 2 mins to now
    },
    {
      id: uuidv1(),
      name: "Alarm number seven",
      alertAt: new Date((new Date()).valueOf() + 180000).toISOString() // add 5 mins to now
    },
    {
      id: uuidv1(),
      name: "Alarm number eight",
      alertAt: new Date((new Date()).valueOf() + 240000).toISOString() // add 6 mins to now
    }
  ];
}


export function getAllAlarms(req, res): void {
  res.json(findAlarms());
}

export function getAlarmDetails(req, res): void {
  res.json(
    {
      id: req.swagger.params.id.value,
      name: "Alarm detail",
      alertAt: (new Date).toISOString()
    }
  );
}

export function createAlarm(req, res): void {
  res
    .status(201)
    .json(req.swagger.params.alarm.value);
}
