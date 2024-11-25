#!/bin/bash

sudo apt-get install net-tools -y

java -version
if $1 -eq true; then {
  bash build-and-copy.sh true
} else {
  bash build-and-copy.sh false
} fi;

JAVA_HOME="${JAVA_HOME_21_X64:-$JAVA_HOME_21_arm64}" bash gradlew :backend:build
sudo chmod 777 ./backend/build/libs/backend-1.0.0.jar

docker pull postgres
docker run --name postgres-end-to-end -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=szakal -v ./frontend/cypress/init.sql:/docker-entrypoint-initdb.d/init.sql -d postgres

sudo bash ./backend/run-backend.sh start
