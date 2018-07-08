"use strict";

import * as chai from "chai"; // for .ts tests
import * as mocha from "mocha";
import * as config from "config";

import { mongoDb } from "../../../dist/common/db/crud.js";
import { connectDb } from "../../../dist/common/db/connector";

const expect = chai.expect;
const dbName = process.env.DATABASE || config.get("database");


describe(`'db/connector.ts' tests`, function() {

  describe("test (db) connector function", function() {

    it("should get the db", async function() {
      try {
        const res = await connectDb("mongodb://localhost:27017", dbName);
        expect(res.db.databaseName).to.equal(dbName);
        expect(res.db.writeConcern).to.deep.equal({});
        res.client.close();
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });

  describe("test connection on app is working", function() {

    it("should get a connection object for the app", async function() {
      try {
        const res = (await mongoDb).db;
        expect(res.databaseName).to.equal('testAlarmServer');
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });

  });

});
