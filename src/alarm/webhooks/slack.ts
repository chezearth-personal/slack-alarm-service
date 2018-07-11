"use strict";

import * as config from "config";
import * as rp from "request-promise";


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

export async function postSlack(msg: string): Promise<string> {

  try {

    const completeBody = Object.assign({ text: msg }, body );
    const completeOptions = Object.assign({}, options, { body: JSON.stringify(completeBody) });
    const res: string = await rp(completeOptions);
    return res;

  } catch(e) {

    return Promise.reject(e);

  }

}
