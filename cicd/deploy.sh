#!/bin/bash

cd frontend || exit
mkdir node_modules
#sudo chown -R $USER "./node_modules"
#sudo npm install
npm install
#CI='' sudo npm run build
CI='' npm run build
cd ..
cp -r frontend/build/. backend/src/main/resources/static
mkdir temp
cp -r backend/. temp/

HEROKU_API_TOKEN=$1

cd temp || exit

git init
git config user.email "actions@github.com"
git config user.name "GithubActions"
git add .
git commit -m $2

if git push -f https://heroku:${HEROKU_API_TOKEN}@git.heroku.com/szakal-demo.git master; then
  echo "Push successful"
else
  echo "Git push failed"
  exit 125
fi

cd ..
rm -r -f temp

echo "Deploy successful"
