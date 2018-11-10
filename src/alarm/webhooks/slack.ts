"use strict";

import * as config from "config";
import * as rp from "request-promise";
import { logger } from "../../common/helpers/winston"
import { SlackBody } from "../types/slack";


const errorPrefix: string = `                 - - [${(new Date()).toISOString()}] `


const options = {
  uri: config.get("slack_webhook_url"),
  method: "POST",
  headers: { "Content-Type": "Application/Json" }
};


export async function postSlack( slackAlarm: SlackBody): Promise<string> {

  try {

    const completeOptions = Object.assign({}, options, { body: JSON.stringify(slackAlarm) });
    const res: string = await rp(completeOptions);
    return res;

  } catch(e) {

    logger.write(`${errorPrefix} "${e.message}" "${e.status}"
${e.stack}`,"error");
    return Promise.reject(e);

  }

}
