#!/bin/bash

set -e

if [ "$1" != "development" && "$1" != "staging" && "$1" != "master"]; then
  echo -e "Unknown branch to merge: $1"
else
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
fi
