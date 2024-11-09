#!/bin/bash

cd frontend || exit
CYPRESS_CACHE_FOLDER=./tmp/Cypress npm install
npm run build

cd ..
cp -r ./frontend/build/. ./backend/src/main/resources/static

