#!/bin/bash

set -e

if [ "$1" != "development" ] && [ "$1" != "staging" ] && [ "$1" != "master" ]; then
  echo "\x1b[0;31mERROR: \x1b[0mUnknown branch to merge: \x1b[0;36m$1\x1b[0m"
else
  echo "Merging changes from \x1b[0;36m$1\x1b[0m to all branches..."
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

  git checkout $1
fi
