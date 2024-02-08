# Todos-lists server

## Description

### API

Inscription/connexion puis gestion de todo listes

### CLI

```bash
# Trouve user avec ID
$ npm run cli -- -- users <id>

# Trouve user avec email
$ npm run cli -- -- users -e <email>
```


## Installation

```bash
$ npm install
```

Copier `.env.exemple` vers `.env` et configurer les options


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Apps & Libs

Avoir les modules configuration, orm et autres séparés permet de les réutiliser dans dans plusieur app.

Par exemple, `api` et `cli` partagent la même configuration, les mêmes entitées, les mêmes services qui interagissent avec ces entitées.
