"use strict"

import { Alarm } from "../../common/types/payloads";

export function findAlarms(): Array<Alarm> {
  return [
    {
      id: "33d9d56a-82a5-11e8-a222-9fd4df3965a5",
      name: "Alarm number one",
      alertAt: new Date((new Date).valueOf() + 60000).toISOString() // add 1 min to now
    },
    {
      id: "4edd64c6-82a5-11e8-9126-8f8bcb3db6cf",
      name: "Alarm number two",
      alertAt: new Date((new Date).valueOf() + 120000).toISOString() // add 2 mins to now
    },
    {
      id: "590cb708-82a5-11e8-8406-87c84401cc07",
      name: "Alarm number three",
      alertAt: new Date((new Date).valueOf() + 180000).toISOString() // add 3 mins to now
    },
    {
      id: "62fd196a-82a5-11e8-8aab-676b114290fe",
      name: "Alarm number four",
      alertAt: new Date((new Date).valueOf() + 240000).toISOString() // add 4 mins to now
    }
  ];
}
