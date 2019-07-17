# NoSQL driver spike
https://eaflood.atlassian.net/browse/FPD-264

## Prerequisites

## Environment variables
Create a .env file with the following configuration (replace as you see fit)
```
MONGO_HOST=mongo
MONGO_PORT=27017
MONGO_PARAMS=?authMechanism=${DEFAULT}
MONGO_ROOT_USERNAME=someuser
MONGO_ROOT_PASSWORD=somepassword
```

## Running
`docker-compose up`