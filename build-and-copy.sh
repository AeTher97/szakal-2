#!/bin/bash

cd frontend || exit
npm run build

cd ..
cp -r ./frontend/build/. ./backend/src/main/resources/static

