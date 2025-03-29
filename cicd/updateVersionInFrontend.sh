#!/bin/bash

read -r semverVersion < ./build/semver/version.txt
echo $semverVersion

sed -i -e "s/VITE_SZAKAL_VERSION=.*/VITE_SZAKAL_VERSION=$semverVersion/g" ./frontend/.env.development
sed -i -e "s/VITE_SZAKAL_VERSION=.*/VITE_SZAKAL_VERSION=$semverVersion/g" ./frontend/.env.production