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
    .then(dts => fs.writeFileSync(
      './src/common/types/payloads.d.ts',
      `\n// The contents of this file are auto-generated from swagger.yaml definitions.\n// Do not edit directly.\n\n${dts}\n`
    ))
    .catch(e => console.log(e))
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
