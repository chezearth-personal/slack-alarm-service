# Slack Alarm Microservice

## Introduction

API to accept and list alarms and a webhook and post them onto Slack.

> A small detail: I have installed typescript and gulp in the project directory with `./node_modules/.bin` added to my Bash `PATH` variable. If, for example, Typescript or Gulp are installed globally and you want to use those, the application should still work. Gulp uses the `gulp-typescript` library to carry out its compile task and Mocha uses `ts-node` to compile typescript tests

The DB used is MongoDB and the project is configured to connect to a single containerised instance, without authentication. The Mongo container has a volume mounted onto the `./mongo/data` local project directory.

The test suite uses a different database from the that used with other environments. Data are created during the test and are deleted if the CLEAN_TEST environment variable is set to 'true', 't', 'yes' or 'y'. They may be left un-cleaned to inspect the results, e.g. with the Mongo shell.

The e2e tests ...[TODO]

The scheduler is set to check the database every second, although this can be changed in the configs.

Each step in the project has a

> Label:

and this label corresponds to a tag the git index, which can be rewound with
```bash
$ git checkout <label>
```

## Prerequisites

1. Nodejs 8.1 with the appropriate updated npm package manager
1. Docker (latest version) with at least docker-compose version 2.
1. The e2e and mocks tests that are run with curl use the `uuid` bash command to generate the required UUIDs in the `POST alarm/` request bodies and `GET alarm/{id}` query strings. The command can be installed with Homebrew (`brew install ossp-uuid`) on MacOS or `apt-get uuid` on Debian/Ubuntu Linux

If the project is run as standalone app instead of in containers, then MongoDB will need to be installed on the host machine and the `development.yml` and `test.yml` config files changed to include the appropriate connection strings.

## How to set up and run the project

- install docker and start it up
- create a channel or team or use an existing channel in in Slack and get the webhook from it
- copy the webhook url from Slack and place it over the value for `slack_webhook_url` in the YAML below. Also add in the desired values for your Slack channel, user name and any default slack icon emoji:```yaml
# Slack webhook url, channel, username and default emoji icon is kept here
slack_webhook_url: "https://hooks.slack.com/services/<webhook>"
slack_channel: "#general"
slack_username: "webhookbot"
slack_icon_emoji: ":ghost:"
```Copy the contents and paste them in a file called `slack.yaml` in the `config/` directory.
- go into the terminal, `cd` into the project and type `docker-compose up`. The terminal window will show the build process.
- Docker will build the images, which includes the database and the code dependencies, then it will start the containers and the nodejs apps will connect up to the database and open port 3000 through to the host. The logs for each container will be shown in the terminal window. If you don’t wish to see the logs, you can fork by adding `-d` or `--detach` to `docker-compose up` (i.e. `docker-compose up -d`)
- Try `curl`ing into the app (you need a new uuid string--I use the OSSP `uuid` utility which I get from Homebrew `brew install ossp-uuid`):
```curl -X GET http://127.0.0.1:3000/alarms
curl -X POST -H 'Cache-Control: no-cache' -H 'Content-Type: application/json' -d '{"id": "'$(uuid)'", "name": "Create a cool name", "alertAt": "2018-10-10T09:07:23.000Z", "iconEmoji":":+1:"}' http://127.0.0.1:3000/alarms```
Or you can use Postman :slightly_smiling_face:
If you started Docker-Compose in detached mode (`-d`), then you can see the logs for one of the services with `docker logs -f <container>`, where container is one of `slack-alarm-service_mongo-db_1`, `slack-alarm-service_alarm-server_1` or `slack-alarm-service_rest-api_1`. (edited)

## How the Project was Constructed

The project was regularly committed and the main commits have been tagged, this helps in reviewing the development process. The steps are:

1. Run the Swagger initialiser to create the boilerplate code that the API is built from.
1. Develop the Swagger specification and test with mocks on the Swagger Editor
1. Re-organise and simplify the directory structure, adding in the gulpfile and typescript config files, as well as the Typescript `src/` directory and the dbHandlers and workers directories (for the scheduler).
1. Develop unit tests and write the code for the base db modules: the connector and db CRUD operations
1. Logging and environment configs
1. Develop unit tests and write the code for the controllers
1. Develop unit tests and write the code for the alarm server and its helpers
1. Develop e2e tests, with Slack receiving the alarms.
1. Build the docker images and run them with docker-compose.


### 1. Running the Swagger initialiser

> Label: initialise-project-with-swagger

The project was initiated with the Swagger npm codegen that was installed globally.
```bash
$ npm install -g swagger

$ cd path/to/slack-alarm/
$ swagger project create api
```
This README was written up. The project, which is just a 'Hello World' at this stage, can be tested by running `$ swagger project start api` and using the supplied command `$ curl http://127.0.0.1:10010/hello?name=My-name`. The Swagger spec file can then be edited with
```bash
$ swagger project edit api
```
### 2. Edited the Swagger Spec

> Label: swagger-spec-with-mocks

Project port changed to `3000`, base route remains `api/`. Test file copied over for easy ref.

The `POST /alarms`, `GET /alarms` and `GET /alarms/{id}` routes added in along with the `Alarm` object definition. The swagger spec can be tested on the editor with the supplied dummy data in `./api/mocks/alarm.js`.

The API be tested on mocks by starting the project with
```bash
$ cd path/to/slack-alarm/ && swagger project start -m api
```
and then, to test from the editor enter:
```bash
$ cd path/to/slack-alarm/ && swagger project edit api
```
in another terminal window and on the editor in the browser, click `Try this operation` in the panel on the right.

Alternatively, Postman can be used or curl requests can be made in bash, e.g.,
```bash
$ curl -i -H "Content-Type: application/json" -X POST -d '{"id":"'$(uuid -v1)'","name":"Message to be sent to Slack","alertAt":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' http://127.0.0.1:3000/alarms
$ curl http://127.0.0.1:3000/alarms
$ curl http://127.0.0.1:3000/alarms/$(uuid -v1)
```
The data returned are just mocks but swagger validates the UUID pattern in the `id` field and the date pattern in the `alertedAt` field.

The following requests all fail because of data validation:
```bash
$ curl -i -H "Content-Type: application/json" -X POST -d '{"id":"123ade-34","name":"Message to be sent to Slack","alertAt":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' http://127.0.0.1:3000/alarms
$ curl -i -H "Content-Type: application/json" -X POST -d '{"id":"'$(uuid -v1)'","name":"Message to be sent to Slack","alertAt":"'$(date -u +%d/%m/%Y %H:%M:%S)'"}' http://127.0.0.1:3000/alarms
$ curl http://127.0.0.1:3000/alarms/asdg
```
Note, the api still has the `GET /hello` route example installed by the codegen, this will be deleted later.

### 3. Re-organised the Directory Structure, added in the Gulp, TypeScript and Docker config Files

> Label: re-organised-directory-structure

Typescript was installed. The `tsconfig.json` file, `src/api/` and `src/alarm` directoris were added. The orginal `api/app.js` file has been changed to `src/api/server.ts` and modified to 'Typescript-style'. The `src/alarm/` directory also has a `server.ts` file and both will compile to Javascript `server.js` files in the `dist/api/` and `dist/alarm/` directories, respectively.

Gulp was installed. The gulpfile does two things: it watches `*.ts` files in the `src/` directory, recompiling on changes; and it watches the `api/swagger/swagger.yaml`, regenerating the `payloads.d.ts` file in `src/api/controllers/` on changes. The latter provides handy payload type definitions for TypeScript.

The files and directories have been extensively rearranged. The previous `api/` directory is removed, with the `package.json` and `tsconfig.json` files in the project root. Swagger-node does not like the Swagger spec file (`swagger.yaml`) to be placed in a path other than `./api/swagger` (it can be moved but the new location must be exported to the `swagger_swagger_fileName` env variable -- see https://github.com/swagger-api/swagger-node/issues/373). To keep things simple, I have kept it the original path.

This means the `$ swagger project start` and `$ swagger project edit` commands no longer take a directory argument (it was previously `api`). Hence,
```bash
$ cd path/to/slack-alarm
$ swagger project start # to start the server daemon (it will restart after any chganges are saved and gulp has recompiled)
$ swagger project start -m # to start with mocks
$ swagger project edit # to edit the swagger spec in the browser
```

Lastly, the initial docker container builds were made, and are orchestrated by docker-compose. For this, there are two Dockerfiles (`Dockerfile-api` and `Dockerfile-alarm`) which are used to build the API and Alarm node apps in separate containers. Since the Alarm has not yet been created, a simple recursive loop with a time has been set up to log a short message repeatedly for testing the containers. To see this test, use
```bash
$ docker-compose up
```
which will show the of logs of the two containers on the terminal.

### 4. Develop Unit Tests and Write the Code for the Base DB Modules

> Label: develop-tests-and-code-for-db

`connector.test.ts` and `connector.ts` module in directory `common/db/`. The MongoDB Nodejs client library has changed from v 2 to v 3 in that the `connect()` method no longer returns a Db instance; it now returns a MongoClient instance from which the db is accessed.

CRUD testing in `crud.test.ts` and CRUD operations in `crud.ts` module in directory `common/db/`.

The testing uses mocks generated by a function `alarm/mocks`, which are saved to a collection of 'alarms' in the test database ('testAlarmServer') in MongoDB, which get deleted in forthcoming rounds.

MongoDB uses the `_id` field as the unique identifier--a unique ObjectID can be generated by the database for the inserted document (=record) if this field is missing. However, since the UUID supplied by the client in this case is expected to be unique, the `id` field is re-assigned to the `_id`.

The tests are run with
```bash
$ npm test
```
**not**
```bash
$ swagger project test
```
Used the 'config' library with three config files (`default.yaml`, `development.yaml` and `test.yaml`) to choose configurations according to the  environment. Testing in a `test` environment (`NODE_ENV`), and uses a different database from running.

### 5. Logging and environments

> Label: logging-and-environments

Logging is done with popular libraries `Winston` and `Morgan`, which are disabled during testing. The Apache format is used, and the output is written to stdout.

The `swagger project start` phrase sets the node environment to "development". The node environment is set to "production" on the docker images. A `production.yaml` config file has been added.

### 6. Develop Unit Tests and Code for the Controllers and Models

> Label: develop-tests-and-code-for-controllers

`alarms.test.js` was developed with `alarms.ts` for the alarms controller. Tests are run off the mock data returned by the `findAlarms()` function in the `alarm/mocks/alarms.ts` module.

The `helper.ts` file in `common/db/` was moved to a new `api/models/` directory because the functionality there is primarily concerned with data shape and structure (e.g. `id`s to `_id`s, date strings to Date objects. The `alarms.ts` module in models also handles uniqueness of the id (the uniqueness of the UUIDs in the id field are handles by MongoDB itself) and alertAt field (only a single alert can go off at a particular time). These data considerations are called by the controller and no longer by the db CRUD operations.

The data are created and read from the test database. The environment variable, `CLEAN_TEST`, determines if all data are cleaned out at the end of the test. This variable needs to be set to 'true', 'yes', 't' or 'y' (case insensitive) for this to happen -- any other value will leave the data in after the test.

The last task in this section was to upgrade the docker network to include a mongodb container, which has a volume linked to a local project directory -- `mongo-data/` (which is not in the repository).

This is a good time to remove the boilerplate `hello` path, controller and definitions.

### 7. Develop Unit Tests and Write the Code for the Alarm Scheduler

> Label: develop-alarm-scheduler

The Alarm Scheduler functions as a separate unit from the API. The scheduler polls the database every second checking to see if there are any alarms with the `alertAt` field falling into that second. If it finds any, it willsend the name to Slack.

This work was trivial, although the alarm can handle more than one alarm per second; however a second is the tolerance for the Slack notification and the stored `alertAt` value.

The docker image was rebult. I have left port 27007 open to the docker Mongo container incase the user wants to look in there (I left port 27017 alone as a local instance may be runnng as well).

The Slack settings are configurable; this includes the URL for the webhook, the desired Slack channel and even the image. Furthermore the polling interval for the scheduler can be changed.

The Mongo container is set to have a volume mounted in the `mongo/data` directory in the project root.
