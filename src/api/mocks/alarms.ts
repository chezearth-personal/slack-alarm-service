"use strict";


export function getAllAlarms(req, res): void {
  res.json(
    [
      {
        id: "f9415462-81d4-11e8-96b9-cb7df957e0fa",
        name: "Alarm number 1",
        alertAt: new Date(((new Date).valueOf() + 60000)).toISOString() // add 1 min from now
      },
      {
        id: "030ec376-81d5-11e8-aba4-b7c7412d5466",
        name: "Alarm number 2",
        alertAt: new Date(((new Date).valueOf() + 120000)).toISOString() // add 2 mins from now
      },
      {
        id: "d5a509d8-82ea-11e8-ad6c-675169738d6e",
        name: "Alarm number 3",
        alertAt: new Date(((new Date).valueOf() + 180000)).toISOString() // add 3 mins from now
      },
      {
        id: "dec43714-82ea-11e8-b439-f7da6cb22155",
        name: "Alarm number 4",
        alertAt: new Date(((new Date).valueOf() + 240000)).toISOString() // add 4 mins from now
      }
    ]
  );
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
