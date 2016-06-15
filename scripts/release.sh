#!/bin/bash

set -e

# Set variables.
ORIGIN_URL=`git config --get remote.origin.url`

# Publish docs to gh-pages branch.
echo "Publishing to gh-pages branch..."

if [ `git branch | grep gh-pages` ]
then
  git branch -D gh-pages
fi
git checkout -b gh-pages

# Move public to root and delete everything else.
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name 'public' ! -name '.git' ! -name '.gitignore' -exec rm -rf {} \;
mv public/* .
rm -R public/

# Push to gh-pages.
git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_EMAIL"
git add -fA
git commit --allow-empty -m "$(git log -1 --pretty=%B) [ci skip]"
git push -f $ORIGIN_URL gh-pages

echo "Done"

exit 0
