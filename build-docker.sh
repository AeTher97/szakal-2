#!/bin/bash

bash build-and-copy.sh

cd backend
bash gradlew build
cd ..

docker build -f ./cicd/Dockerfile -t szakal:latest .