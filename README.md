# node-nestjs

This is a big file upload example project written by nestJS.

## feature

* [x] **[Nest](https://github.com/nestjs/nest)**
* [x] [MongoDB](https://www.mongodb.com/) with [typeorm](https://github.com/typeorm/typeorm)
* [X] [class-validator](https://github.com/typestack/class-validator)
* [x] [Jest](https://github.com/facebook/jest)
* [x] [winston](https://github.com/winstonjs/winston)
* [x] [Helmet](https://github.com/helmetjs/helmet)
* [x] [Multer](https://github.com/expressjs/multer)
* [x] [Passport](https://github.com/jaredhanson/passport) for `JWT` authentication 
* [x] Support `hmr` and bundle server-side code with [Webpack](https://github.com/webpack/webpack)

## Getting started

### Installation

Install dependencies
```bash
$ npm ci
```
or
```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# watch mode with hot module replacement 
$ npm run start:hmr

# debug app
$ npm run start:debug

# build app
$ npm run build

# launch in test environment
$ npm run launch:prod

# launch in production environment
$ npm run launch:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Database

The example codebase uses [Typeorm](http://typeorm.io/) with MongoDB.

Create a new mongo database with the name `db_net_disk`(or the name you specified in the `config.db`)

Set database settings in `congfig/index.ts`:

```typesctipt
{
  ...other config
  db: {
    type: 'mongodb',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '27017', 10),
    username: 'ndUser',
    password: '123456',
    database: 'db_net_disk',
    synchronize: true,
    logging: true
  }
  ...other config
}
```

On application start, collections for all entities will be created.

## Project structure

```txt
.
├── config: application config directory
│   ├── config.dev.js: config for development environment
│   ├── config.pre.js: config for pre production environment
│   ├── config.production.js: config for production environment
│   ├── config.test.js: config for test environment
│   └── index.js: base config
├── docs: project document directory
├── src
│   ├── common: common directory
│   │   ├── dto: common dto directory
│   │   ├── entities: common entitie directory
│   │   ├── enums: common enum directory
│   │   ├── exceptions: common exception directory
│   │   ├── filters: common filter directory
│   │   ├── interceptors: common interceptor directory
│   │   └── pipes: common dto directory
│   ├── utils: uility function directory
│   ├── modules: nest module directory
│   │   ├── user: user module directory
│   │   │   ├── dto: dto directory for user module
│   │   │   ├── entities: entity directory for user module
│   │   │   ├── user.controller.ts: user controller
│   │   │   ├── user.module.ts: user module
│   │   │   └── user.service.ts: user service
│   │   ├── file: file module directory
│   │   │   └── ...
│   │   ├── auth: auth module directory
│   │   │   └── ...
│   │   └── app-logger: app logger module directory
│   │       └── ...
│   ├── app.controller.ts: app controller
│   ├── app.controller.spec.ts: unit test for app controller
│   ├── app.service.ts: app service
│   ├── app.module.ts: app module
│   └── main.ts: main entry
└── test: e2e test directory
    └── app.e2e-spec.ts
    └── jest-e2e.json
```

## Frontend

See [node-nestjs-frontend](https://github.com/KyLeoHC/node-nestjs-frontend).

You can run `node-nestjs` and `node-nestjs-frontend` at the same time.So you can see the interaction effect.

## License

[MIT License](https://github.com/KyLeoHC/node-nestjs/blob/master/LICENSE)
