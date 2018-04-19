#!/bin/bash

PACKAGE_NAME=$(cat package.json | jq -r ".name")
PACKAGE_VERSION=$(cat package.json | jq -r ".version")
PACKAGE_FILE=$PACKAGE_NAME-$PACKAGE_VERSION.zip
GIT_ORIGIN_URL=`git config --get remote.origin.url`
IS_RELEASE=`[[ $(git describe --tags) =~ ^v[0-9]+(\.[0-9]+)+(-rc[0-9]+)?(-alpha[0-9]+)?$ ]] && echo true || echo false`
