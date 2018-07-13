"use strict";

import * as chai from "chai";
import * as uuidv4 from "uuid";

import { postSlack } from "./slack";


const expect = chai.expect;


describe(`'webhooks/slack.ts' tests`, function() {


  describe("sending out messages", function() {

    it("should send a simple message", async () => {

      try {

        const res = await postSlack({ _id: uuidv4().toString(), name: 'This is the Test Suite testing the Slack sender', alertAt: new Date(), iconEmoji: ":parrotdealwithit:"})
        expect(res).to.equal('ok');
        return Promise.resolve();

      } catch(e) {

        return Promise.reject(e);

      }

    });

  });


});
