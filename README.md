## Project setup

```bash
$ npm install
```

### .env file setup
```
PORT=3000

DB_HOST=hh-pgsql-public.ebi.ac.uk
DB_PORT=5432
DB_NAME=pfmegrnargs
DB_USER=reader
DB_PASS=NWDMCE5xdipIjRrp

JWT_SECRET=very_secret_for_dev
JWT_EXPIRES_IN=3600s
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# e2e tests
$ npm run test:e2e
```

## Swagger Documentation
```
http://localhost:3000/api/docs
```

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
