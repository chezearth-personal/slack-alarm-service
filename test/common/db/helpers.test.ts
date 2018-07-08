"use strict";

import * as chai from "chai"; // for .ts test
import * as mocha from "mocha";

import { ObjectID } from "mongodb";

import { documentExists, toUnderscoreId, toId } from "../../../dist/common/db/helpers";

const rewire = require("rewire");

const helperFuncs = rewire("../../../dist/common/db/helpers");
const buildField = helperFuncs.__get__("buildField");

const expect: Chai.ExpectStatic = chai.expect;


const payload = {
  id: "d4fb628e-82f9-11e8-8080-cf75bf620a4c",
  name: "Freddie Mercury",
  alertAt: ""
}

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
        alertAt: "",
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


  describe("toUnderscoreId() test", function() {

    it(`should change the 'id' field in the payload to '_id'`, function() {
      expect(toUnderscoreId(payload)._id).to.equal("d4fb628e-82f9-11e8-8080-cf75bf620a4c");
      expect(toUnderscoreId(payload)).eqls({
        _id: "d4fb628e-82f9-11e8-8080-cf75bf620a4c",
        name: "Freddie Mercury",
        alertAt: ""
      });
      payloadDb = Object.assign({}, toUnderscoreId(payload));
    });

  });


  describe("toId() test", function() {

    it(`should change the '_id' field in the database document to 'id'`, function() {
      expect(toId(payloadDb).id).to.equal("d4fb628e-82f9-11e8-8080-cf75bf620a4c");
      expect(toId(payloadDb)).eqls(payload);
    });

  });


});
