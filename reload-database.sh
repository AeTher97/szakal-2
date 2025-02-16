#!/bin/bash

if [ "$(docker inspect -f '{{.State.Running}}' postgres-end-to-end)" == "true" ]; then
  docker stop postgres-end-to-end
  docker rm postgres-end-to-end
fi;


docker run --name postgres-end-to-end -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=szakal -v "/$PWD/frontend/cypress/init.sql:/docker-entrypoint-initdb.d/init.sql" -d --network=szakal-network postgres

until [ "$(docker inspect -f '{{.State.Running}}' postgres-end-to-end)" == "true" ]; do
  echo "Waiting for postgres to come online"
  sleep 1;
done;