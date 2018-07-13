"use strict";

import * as config from "config";
import * as rp from "request-promise";
import { logger } from "../../common/helpers/winston"
import { AlarmDb } from "../../common/types/docs";


const errorPrefix: string = `                 - - [${(new Date()).toISOString()}] `


const options = {
  uri: config.get("slack_webhook_url"),
  method: "POST",
  headers: { "Content-Type": "Application/Json" }
};

const body = {
  icon_emoji: config.get("slack_icon_emoji"),
  channel: config.get("slack_channel"),
  username: config.get("slack_username"),
}

export async function postSlack(alarmDetails: AlarmDb): Promise<string> {

  try {

    const completeBody = Object.assign(
      {},
      body,
      { text: alarmDetails.name },
      alarmDetails.iconEmoji ? { icon_emoji: alarmDetails.iconEmoji } : {}
    );
    const completeOptions = Object.assign({}, options, { body: JSON.stringify(completeBody) });
    const res: string = await rp(completeOptions);
    return res;

  } catch(e) {

    logger.write(`${errorPrefix} "${e.message}" "${e.status}"
${e.stack}`,"error");
    return Promise.reject(e);

  }

}
