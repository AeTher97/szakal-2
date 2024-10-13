!/bin/bash

n=0
until [ "$n" -ge 5 ]
do
   docker pull postgres && docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres && break
   n=$((n+1)) 
   echo 'Docker not available, retrying in 10 seconds'
   sleep 10
done

gh codespace ports visibility  3000:public -c $CODESPACE_NAME
gh codespace ports visibility  8080:public -c $CODESPACE_NAME

cd frontend 
backendAddress=$(gh codespace ports -c $CODESPACE_NAME | grep 8080 | grep -o 'https.*')
sed -i "s|http://localhost:8080/api|${backendAddress}/api|" .env.development
npm install
