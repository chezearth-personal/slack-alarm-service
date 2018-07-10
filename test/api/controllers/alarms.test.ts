"use strict";

import * as chai from "chai";
import * as rp from "request-promise";
import * as util from "util";

const chaiHttp: Chai.ExpectStatic = require("chai-http");

const app: Express.Application = require("../../../dist/api/server").default;

chai.use(chaiHttp);


const baseUri: string = "http://127.0.0.1:3000"
const options = {
  headers: {
    "Content-Type": "application/json"
  },
  json: true
}


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

      this.retries(10);
      // const del = await deleteAll("alarms");
      //
      const res0: ChaiHttp.Response = await chai
        .request(app)
        .get("/alarms");
      console.log("Alarms on system", res0.body);

      const res1: ChaiHttp.Response = await chai
        .request(app)
        .post("/alarms")
        .type("application/json")
        .send({
          id: "17c79534-8380-11e8-94fc-1b8838ae24d0",
          name: "Message to be sent to Slack",
          alertAt: "2018-07-09T13:58:01.000Z"
        });
      console.log("Alarms added", util.inspect(res1.body, {depth: null}));
      const res2: ChaiHttp.Response = await chai
        .request(app)
        .get("/alarms");
        console.log("Alarms on system", res2.body);


      return Promise.resolve();
    } catch(e) {
      return Promise.reject(e);
    }
  });

/*
  after(async function() {
    try {
      if(process.env.CLEAN_TEST && ["true", "yes", "y", "t"].includes(process.env.CLEAN_TEST.toLowerCase())) {
        await deleteAll("alarms");
      }
      return Promise.resolve();
    } catch(e) {
      return Promise.reject(e);
    }
  });
*/

  describe("#POST 4 alarms", function() {

    alarmsList.forEach((elem, i) => {

      if(i > 1) {

        console.log(i, alarmsList[i]);
        it(`should create alarm ${i}`, async function() {

          try {

            console.log(i, alarmsList[i]);
            // const res = await rp(Object.assign(
              // options,
              // {
                // uri: `${baseUri}/alarms`,
                // method: 'POST',
                // body: alarmsList[i]}
            // ));
            const res: ChaiHttp.Response = await chai
              .request(app)
              .post("/alarms")
              .type("application/json")
              .send(alarmsList[i])
            // expect(res).to.have.status(201);
            // expect(res).to.be.json;
            expect(res.body).to.deep.equal(elem);
            // console.log(res.body);
            // console.log(elem);
            return Promise.resolve();

          } catch(e) {

            return Promise.reject(e);

          }
        });

      }

    });

  });
/*
  describe("#GET all alarms", function() {

    it("should get all alarms", async function() {
      try {
          const res: ChaiHttp.Response = await chai
          // const res = await chai
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
        // const res = await chai
          .request(app)
          .get(`/tasks/${alarm_id}`);
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
*/

});
