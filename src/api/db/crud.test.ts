"use strict";

import * as chai from "chai";
import * as mocha from "mocha";
import { DeleteWriteOpResultObject } from "mongodb";

import {
  create,
  deleteAll,
  getMany,
  getOne,
} from "../../../dist/common/db/crud";
import { findAlarms } from "../../../dist/api/mocks/alarms";
import { payload2doc } from "../../../dist/api/models/alarms";
import { AlarmDb } from "../../../src/common/types/docs";

//const alarmList = require("../../resources/alarm-data.json")

// mocks are useful for testing, call the function to instantiate the time
const alarmList = findAlarms();

const expect: Chai.ExpectStatic = chai.expect;


describe(`'db/crud.ts' tests. Database CRUD`, function() {

  before(async function() {

      try {

        const docs: AlarmDb = await getMany("alarms", {}, {}, {});
        const del: DeleteWriteOpResultObject["result"] = await deleteAll("alarms");
        expect(docs).to.have.length(del.n);
        return Promise.resolve();

      } catch(e) {

        return Promise.reject(e);

      }

  });

  describe("create documents", function() {

      it("should create document 0", async function() {

        try {

          const doc: AlarmDb = payload2doc(alarmList[0]);
          const res: AlarmDb = await create("alarms", doc);
            expect(res.name).eqls("Alarm number zero");
            return Promise.resolve();

          } catch (e) {

            return Promise.reject(e);

          }

      });

      it("should create document 1", async function() {

        try {

          const doc: AlarmDb = payload2doc(alarmList[1]);
          const res: AlarmDb = await create("alarms", doc);
          expect(res.name).eqls("Alarm number one");
          return Promise.resolve();

        } catch(e) {

          return Promise.reject(e);

        }

      });

  });


  describe("find documents", function() {

      it("should find all documents", async function() {

        try {

          const res: AlarmDb[] = await getMany("alarms", {}, {}, {});
          expect(res).to.have.length(2);
          expect(res[1].name).equals(alarmList[1].name);
          return Promise.resolve();

        } catch(e) {

          return Promise.reject(e);

        }

      });

      it("should find the first document", async function() {

        try {

          const res: AlarmDb = await getOne("alarms", alarmList[0].id, {}, {});
          expect(res).eqls({
            _id: alarmList[0].id,
            name: "Alarm number zero",
            alertAt: new Date(alarmList[0].alertAt)
          });
          return Promise.resolve();

        } catch(e) {

          return Promise.reject(e);

        }

      });

  });


});
