#!/bin/bash

cd frontend || exit
if $1 -eq true; then {
  sudo npm cache clean -f
  sudo npm install -g n
  sudo n stable
  sudo n latest
} fi;
CYPRESS_CACHE_FOLDER=./tmp/Cypress npm install
npm run build

cd ..
cp -r ./frontend/build/. ./backend/src/main/resources/static

