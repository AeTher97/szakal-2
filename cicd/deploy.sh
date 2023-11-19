#!/bin/bash

# Install docker for integration testing
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

#Install java
apt install openjdk-21

# Launch backend integration test
sudo sh backend/mvnw integration-test
cd ..

cd frontend || exit
mkdir node_modules
sudo chown -R $USER "./node_modules"
sudo npm install
CI='' sudo npm run build
cd ..
cp -r frontend/build/. backend/src/main/resources/static
mkdir temp
cp -r backend/. temp/
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
