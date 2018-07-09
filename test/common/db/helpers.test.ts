"use strict";

import * as chai from "chai"; // for .ts test
import * as mocha from "mocha";

import { ObjectID } from "mongodb";

import {
  documentExists,
  payload2doc,
  doc2payload
} from "../../../dist/common/db/helpers";

const rewire = require("rewire");

const helperFuncs = rewire("../../../dist/common/db/helpers");
const buildField = helperFuncs.__get__("buildField");

const expect: Chai.ExpectStatic = chai.expect;

const alertAt: string = new Date((new Date).valueOf() + 120000).toISOString();
const payload = {
  id: "d4fb628e-82f9-11e8-8080-cf75bf620a4c",
  name: "Freddie Mercury",
  alertAt: alertAt
};

let payloadDb;

describe(`'db/helper.ts' tests`, function() {

  describe("buildField() test", function() {

    it("should make an object out of two strings", function() {
      expect(buildField("sense", { key1: "nonsense", key2: "more nonsense" }))
        .eqls({ sense: { key1: "nonsense", key2: "more nonsense" } });
    });

    it("should assign a key and value to an existing object", function() {
      expect(buildField("sense", "nonsense", payload)).eqls({
        id: "d4fb628e-82f9-11e8-8080-cf75bf620a4c",
        name: "Freddie Mercury",
        alertAt: alertAt,
        sense: "nonsense"
      });
    });

  });

  describe("checkExists() test", function() {

    it("should have an empty object", async function() {
      try {
        const res: boolean = await documentExists("users", "a4a1da54-82fa-11e8-98d8-cffa00ec7eee");
        expect(res).to.equal(false);
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });


  describe("payload2doc() test", function() {

    it(`should change the 'id' field in the payload to '_id'`, function() {
      expect(payload2doc(payload)._id).to.equal("d4fb628e-82f9-11e8-8080-cf75bf620a4c");
      expect(payload2doc(payload)).eqls({
        _id: "d4fb628e-82f9-11e8-8080-cf75bf620a4c",
        name: "Freddie Mercury",
        alertAt: new Date(alertAt)
      });
      payloadDb = Object.assign({}, payload2doc(payload));
    });

  });


  describe("doc2payload() test", function() {

    it(`should change the '_id' field in the database document to 'id'`, function() {
      expect(doc2payload(payloadDb).id).to.equal("d4fb628e-82f9-11e8-8080-cf75bf620a4c");
      expect(doc2payload(payloadDb)).eqls(payload);
    });

  });


});
