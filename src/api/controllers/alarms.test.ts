"use strict";

import * as chai from "chai";
import * as util from "util";

import { findAlarms } from "../../../dist/alarm/mocks/alarms";
import { deleteAll } from "../../../dist/common/db/crud";


const chaiHttp: Chai.ExpectStatic = require("chai-http");

const app: Express.Application = require("../../../dist/api/server").default;

chai.use(chaiHttp);
const expect = chai.expect;


const alarmsList = findAlarms();
// const alarmsList = require("../../resources/alarm-data.json");


describe("'controllers/tasks.ts' tests. API requests", function() {


  let alarm_id: string; // variable to hold a task's id for the 'GET all' request

  describe("#POST 6 alarms", function() {

    alarmsList.forEach((elem, i) => {

      it(`should create alarm ${i}`, async function() {

        try {

          const res: ChaiHttp.Response = await chai
            .request(app)
            .post("/alarms")
            .type("application/json")
            .send(alarmsList[i])
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.deep.equal(elem);
          return Promise.resolve();

        } catch(e) {

          return Promise.reject(e);

        }

      });

    });

  });

  describe("#GET all alarms", function() {

    it("should get all alarms", async function() {

      try {

          const res: ChaiHttp.Response = await chai
            .request(app)
            .get("/alarms");
          alarm_id = res.body[5].id;
          expect(res).to.have.status(200);
          expect(res.body).to.have.length(alarmsList.length + 2);
        return Promise.resolve();

      } catch(e) {

        return Promise.reject(e);

      }

    });

  });

  describe("#GET one alarm", function() {

    it("should get an alarm", async function() {

      try {

        const res: ChaiHttp.Response = await chai
          .request(app)
          .get(`/alarms/${alarm_id}`);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(Object.assign(
          {},
          alarmsList[3], // alarmList #3 === databaseList #5, 2 extra alarms stored
        ));
        return Promise.resolve();

      } catch(e) {

        return Promise.reject(e);

      }

    });

  });


});
