"use strict";

import * as chai from "chai"; // for .ts test

import {
  isUnique,
  payload2doc,
  doc2payload
} from "../../../dist/api/models/alarms";
import { AlarmDb } from "../../common/types/docs"
import { getMany, deleteAll } from "../../../dist/api/db/crud";

// rewire is handy for 'importing' functions that are not exported
const rewire = require("rewire");
const helperFuncs = rewire("../../../dist/api/models/alarms");
const buildField = helperFuncs.__get__("buildField");


const expect: Chai.ExpectStatic = chai.expect;

const alertAt: string = new Date((new Date).valueOf() + 120000).toISOString();
const testPayload = {
  id: "d4fb628e-82f9-11e8-8080-cf75bf620a4c",
  name: "Freddie Mercury",
  alertAt: alertAt
};


let payloadDb: AlarmDb;
let alarmsDb: AlarmDb[];

describe(`'models/alarms.ts' tests`, function() {


  describe("buildField() test", function() {

    before(async function() {

      try {

        alarmsDb = await getMany("alarms", {}, {}, {});
        return Promise.resolve();

      } catch(e) {

        return Promise.reject(e);

      }

    });

    it("should make an object out of two strings", function() {

      expect(buildField("sense", { key1: "nonsense", key2: "more nonsense" }))
        .eqls({ sense: { key1: "nonsense", key2: "more nonsense" } });

    });

    it("should assign a key and value to an existing object", function() {

      expect(buildField("sense", "nonsense", testPayload)).eqls({
        id: "d4fb628e-82f9-11e8-8080-cf75bf620a4c",
        name: "Freddie Mercury",
        alertAt: alertAt,
        sense: "nonsense"
      });

    });

  });

  describe("'isUnique()' test", function() {

    it("should be TRUE for unique 'alertAt's", async function() {

      try {

        const res_alertAt: boolean = await isUnique({ alertAt: new Date });
        expect(res_alertAt).to.equal(true);
        return Promise.resolve();

      } catch(e) {

        return Promise.reject(e);

      }

    });

    it("should be FALSE for alertAt's that already exist in the database", async function() {

      try {

        const res_alertAt: boolean = await isUnique(
          { alertAt: alarmsDb[4].alertAt }
        );
        expect(res_alertAt).to.equal(false);
        return Promise.resolve();

      } catch(e) {

        return Promise.reject(e);

      }

    });

  });


  describe("'payload2doc()' test", function() {

    it(`should change the 'id' field in the payload to '_id'`, function() {
      expect(payload2doc(testPayload)._id).to.equal("d4fb628e-82f9-11e8-8080-cf75bf620a4c");
      expect(payload2doc(testPayload)).eqls({
        _id: "d4fb628e-82f9-11e8-8080-cf75bf620a4c",
        name: "Freddie Mercury",
        alertAt: new Date(alertAt)
      });
      payloadDb = Object.assign({}, payload2doc(testPayload));
    });

  });


  describe("'doc2payload()' test", function() {

    it(`should change the '_id' field in the database document to 'id'`, function() {
      expect(doc2payload(payloadDb).id).to.equal("d4fb628e-82f9-11e8-8080-cf75bf620a4c");
      expect(doc2payload(payloadDb)).eqls(testPayload);
    });

  });


});
