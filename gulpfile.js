"use strict";

const gulp = require("gulp");
const ts = require("gulp-typescript");
const fs = require("fs");
const yaml = require("js-yaml");
const sw2dts = require("sw2dts");
const JSON_FILES = [ "src/*.json", "src/**/*.json" ];

// pull in the project TypeScript config
const tsProject = ts.createProject("./tsconfig.json");

gulp.task("payloads", () => {

  let swaggerDoc = yaml.safeLoad(fs.readFileSync("./api/swagger/swagger.yaml", "utf8"));

  const options = {
    withQuery: false
  };

  return sw2dts.convert(swaggerDoc, options)
    .then(dts => {
      fs.writeFileSync(
      './src/common/types/payloads.d.ts',
      `\n// The contents of this file are auto-generated from swagger.yaml definitions.\n// Do not edit directly.\n\n${dts}\n`);
      return payload2Doc(dts, [
        { b: "Alarm ", a: "AlarmDb " },
        { b: " id: ", a: " _id: " },
        { b: "alertAt: string", a: "alertAt: Date" }
      ]);
    })
    .catch(e => console.log(e))
    .then(dts => fs.writeFileSync(
      './src/common/types/docs.d.ts',
      `\n// The contents of this file are auto-generated from swagger.yaml definitions.\n// Do not edit directly.\n\n${dts}\n`))
    .catch(e => console.log(e));
});

gulp.task("scripts", () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest("dist/"));
});

gulp.task("watch-ts", gulp.series([ "scripts" ], () => {
  gulp.watch("src/**/*.ts", gulp.series([ "scripts" ]));
}));


gulp.task("watch-swagger", gulp.series([ "payloads" ], () => {
  gulp.watch("api/swagger/swagger.yaml", gulp.series([ "payloads" ]))
}))


gulp.task("assets", function() {
  return gulp.src(JSON_FILES)
  .pipe(gulp.dest('dist/'));
});

gulp.task("default", gulp.parallel([ "watch-swagger", "watch-ts", "assets" ]));


// Makes changes to a .d.ts file string, e.g. names and values can be changed
// The format is:
//    orginal (string): the data string from the original .d.ts files
//    changes (an Array of Objects): each object has a 'b' key ('before') with the old value and an
//    'a' key ('after') with the new value. Care must be taken to ensure that the 'b' value is not
//    found within the 'a' value (is a substring of the 'a' value), or the change will be ignored;
//    e.g., { b: 'id:', a: '_id:' } where 'b' is a substring of 'a'.
function payload2Doc(original, changes) {
  const outF = (data, before, after) => data.indexOf(before) < 0 || after.indexOf(before) >= 0
      ? data
      : outF(
          data.substring(0, data.indexOf(before))
            + after
            + data.substring(data.indexOf(before) + before.length, data.length),
          before,
          after
        );
  return changes.reduce((out, change) => outF(out, change.b, change.a), original);
};
