#!/bin/bash

bash build-docker.sh

docker pull postgres

docker network create -d bridge szakal-network
docker run --name postgres-end-to-end -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=szakal -v "/$PWD/frontend/cypress/init.sql:/docker-entrypoint-initdb.d/init.sql" -d --network=szakal-network postgres

until [ "$(docker inspect -f '{{.State.Running}}' postgres-end-to-end)" == "true" ]; do
  echo "Waiting for postgres to come online"
  sleep 1;
done;

docker run --name Szakal --env=JWT_SECRET=fdsih59543u98gufdoh857y4u9yhtrytr4564876984jy6uth6iu43u4983hjytrpoew-=00- --env=HEROKU_APP_DEFAULT_DOMAIN_NAME=localhost:8080 --env=DATABASE_USERNAME=postgres --env=DATABASE_URL=postgres-end-to-end:5432/szakal --env=DATABASE_PASSWORD=postgres -p 8080:8080 -d --network=szakal-network szakal:latest
