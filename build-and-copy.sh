#!/bin/bash

cd frontend || exit
if $1 -eq true; then {
  sudo npm cache clean -f
  sudo npm install -g n
  sudo n stable
  sudo n 22
} fi;
CYPRESS_CACHE_FOLDER=./tmp/Cypress npm install
if $1 -eq false; then {
  npm run build
} else {
  NODE_ENV=development npm run build
} fi;

cd ..
cp -r ./frontend/build/. ./backend/src/main/resources/static

