"use strict";

import * as chai from "chai";
import * as util from "util";

const chaiHttp: Chai.ExpectStatic = require("chai-http");

const app: Express.Application = require("../../../dist/api/server").default;

chai.use(chaiHttp);


const expect = chai.expect;

import { deleteAll } from "../../../dist/common/db/crud";
//import { findAlarms } from "../../../dist/alarm/mocks/alarms";

//const alarmsList = findAlarms();
const alarmsList = require("../../resources/alarm-data.json");
//console.log(alarmsList);


describe("'controllers/tasks.ts' tests. API requests", function() {

  let alarm_id: string; // variable to hold a task's id for the 'GET all' request

  before(async function() {

    try {

      // const del = await deleteAll("alarms");

      return Promise.resolve();

    } catch(e) {

      return Promise.reject(e);



  });


  after(async function() {

    try {

      if(
        process.env.CLEAN_TEST
          && ["true", "yes", "y", "t"]
            .includes(process.env.CLEAN_TEST.toLowerCase())
      ) await deleteAll("alarms");
      return Promise.resolve();

    } catch(e) {

      return Promise.reject(e);

    }

  });


  describe("#POST 4 alarms", function() {

    alarmsList.forEach((elem, i) => {

      if(i > 1) {

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

      }

    });

  });

  describe("#GET all alarms", function() {

    it("should get all alarms", async function() {

      try {

          const res: ChaiHttp.Response = await chai
            .request(app)
            .get("/alarms");
          expect(res).to.have.status(200);
          expect(res.body).to.have.length(alarmsList.length);
          alarm_id = res.body[1].id;
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
          alarmsList[1],
        ));
        return Promise.resolve();

      } catch(e) {

        return Promise.reject(e);

      }

    });

  });


});
