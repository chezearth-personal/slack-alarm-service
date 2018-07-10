"use strict";

import * as chai from "chai";
import * as mocha from "mocha";

import {
  create,
  deleteAll,
  getMany,
  getOne,
} from "../../../dist/common/db/crud";

const alarmList = require("../../resources/alarm-data.json")

// mocks are useful for testing, call the function to instantiate the time
//import { findAlarms } from "../../../dist/alarm/mocks/alarms"
//const alarmList = findAlarms();

const expect: Chai.ExpectStatic = chai.expect;


describe(`'db/crud.ts' tests. Database CRUD`, function() {

  before(async function() {

      try {

        const docs: any = await getMany("alarms", {}, {}, {});
        const del: any = await deleteAll("alarms");
        expect(docs).to.have.length(del.n);
        return Promise.resolve();

      } catch(e) {

        return Promise.reject(e);
        
      }

  });

  describe("create documents", function() {

      it("should create document 0", async function() {
        try {
          const res:any = await create("alarms", alarmList[0]);
            expect(res.name).eqls("Alarm number zero");
            return Promise.resolve();
          } catch (e) {
            return Promise.reject(e);
          }
      });
      it("should create document 1", async function() {
        try {
          const res: any = await create("alarms", alarmList[1]);
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
          const res: any[] = await getMany("alarms", {}, {}, {});
          expect(res).to.have.length(2);
          expect(res[1].name).equals(alarmList[1].name);
          return Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

      it("should find the first document", async function() {
        try {
          const res: any = await getOne("alarms", alarmList[0].id, {}, {});
          expect(res).eqls({
            id: alarmList[0].id,
            name: "Alarm number zero",
            alertAt: alarmList[0].alertAt
          });
          return Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

  });


});
