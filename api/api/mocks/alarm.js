"use strict";


module.exports = {
  getAllAlarms: getAllAlarms,
  getAlarmDetails: getAlarmDetails,
  createAlarm: createAlarm
};

function getAllAlarms(req, res) {
  res.json([
    {
      id: "f9415462-81d4-11e8-96b9-cb7df957e0fa",
      name: "alarm number 1",
      alertAt: (new Date).toISOString()
    },
    {
      id: "030ec376-81d5-11e8-aba4-b7c7412d5466",
      name: "alarm number 2",
      alertAt: (new Date).toISOString()
    }
  ]);
}

function getAlarmDetails(req, res) {
  res.json({
    id: req.swagger.params.id.value,
    name: "alarm detail",
    alertAt: (new Date).toISOString()
  });
}

function createAlarm(req, res) {
  res.status(201).json(req.swagger.params.alarm.value);
}
