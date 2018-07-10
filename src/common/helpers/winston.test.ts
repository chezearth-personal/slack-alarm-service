"use strict";

import * as chai from "chai"; // for .ts test
import { readFile, unlink } from "fs";
//import * as mocha from "mocha";

import { myStream } from "../../../src/common/helpers/winston";


const expect: Chai.ExpectStatic = chai.expect;


describe("Winston logging (writes this test to a file, which is deleted again)", function() {

  it("should write the correct formated output", (done) => {
    const dateNow = (new Date).toISOString();
    myStream.write(`[${dateNow}] "test item"`);
    myStream.done(() => readFile(
      "test.log",
      "utf8",
      (err, data) => {
        if(err) console.log(err);
        unlink("test.log", (err) => {
          if(err) console.log(err);
          expect(data && data.trimRight()).to.equal(`info: ::ffff:127.0.0.1 - - [${dateNow}] "test item"`);
          done();
        });
      }
    ));

  });

});
