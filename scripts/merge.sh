#!/bin/bash

set -e

if [ "$1" != "development" ]; then
  git checkout development
  git merge $1
  git push
fi

if [ "$1" != "staging" ]; then
  git checkout staging
  git merge $1
  git push
fi

if [ "$1" != "master" ]; then
  git checkout master
  git merge $1
  git push
fi
