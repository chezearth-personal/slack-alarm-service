# Slack Alarm Microservice

## Introduction

API to accept and list alarms and a webhook and post them onto Slack.

> A small detail: I have installed typescript and gulp locally and `./node_modules/.bin` to my `PATH`. If, for example, Typescript or Gulp are installed globally, the application should work but parameters on the `tsconfig.json` and `gulpfile.js` may need changing.

The DB used is MongoDB and the project is configured to connect to a single containerised instance, without authentication. The Mongo container has a volume set to the `./data` local directory.

The test suite has ... tests and uses a different database from the that used for other environments. Data are created during the test and are deleted if the CLEAN_TEST environment variable is set to 'true', 't', 'yes' or 'y'. They may be left un-cleaned to inspect the results, e.g. with the Mongo shell.

The e2e tests ...

The scheduler is set to check the database every second, although this can be changed in the configs.

## Prerequisites

1. Nodejs 8.1 with the appropriate updated npm package manager
1. Docker (latest version) with at least docker-compose version 2.

If running as standalone apps, then MongoDB will need to be installed on the host machine and the `development.yml` and `test.yml` config files changed to include the appropriate connection strings.

## How the Project was Constructed

The project was regularly committed and the main commits have been tagged, this helps in reviewing the development process. The steps are:

1. Run the Swagger initialiser to create the boilerplate code that the API is built from.
1. Develop the Swagger specification and test with mocks on the Swagger Editor
1. Re-organise and simplify the directory structure, adding in the gulpfile and typescript config files, as well as the Typescript `src/` directory and the dbHandlers and workers directories (for the scheduler).
1. Develop unit tests and write the code for the base db modules: the connector and db CRUD operations
1. Logging and environment configs
1. Develop unit tests and write the code for the controllers
1. Develop unit tests and write the code for the alarm server and its helpers
1. Develop e2e tests, with SLack receiving the alarms.
1. Build the docker images and run them with docker-compose.


### 1. Running the Swagger initialiser

> Label: initialise-project-with-swagger

The project was initiated with the Swagger codegen, an npm package that was installed globally
```bash
$ npm install -g Swagger

$ swagger project create users-tasks-manager
```
This README was written up. The project, which is just a 'Hello World' at this stage, can be tested by running `$ swagger project start api` and using the supplied command `$ curl http://127.0.0.1:10010/hello?name=My-name`. The Swagger spec file can then be edited with
```bash
$ swagger project edit
```
