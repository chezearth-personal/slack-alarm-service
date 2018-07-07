"use strict";


export function getAllAlarms(req, res): void {
  res.json(
    [
      {
        id: "f9415462-81d4-11e8-96b9-cb7df957e0fa",
        name: "Alarm number 1",
        alertAt: (new Date).toISOString()
      },
      {
        id: "030ec376-81d5-11e8-aba4-b7c7412d5466",
        name: "Alarm number 2",
        alertAt: (new Date).toISOString()
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
