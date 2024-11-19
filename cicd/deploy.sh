#!/bin/bash

if $3 -eq true; then {
  cd frontend || exit
  mkdir node_modules
  sudo chown -R $USER "./node_modules"
  sudo npm install
  CI='' sudo npm run build
  cd ..
} fi;
cp -r frontend/build/. backend/src/main/resources/static
mkdir temp
cp -r backend/. temp/
cp -r gradle temp/
cp gradlew temp/
echo "rootProject.name = 'root'" > temp/settings.gradle
rm temp/.gitignore

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
