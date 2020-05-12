#!/bin/bash

# Required environment variables:
# - GH_USER: Name of GitHub user to use for the commit
# - NETLIFY_KEY: API key for Netlify

source .circleci/get_opts.sh

NETLIFY_API=https://api.netlify.com/api/v1
NETLIFY_SITE_ID=""
GH_USER=${GH_USER:-$GITHUB_ACTOR}
ORIGIN_URL=`git config --get remote.origin.url`
PACKAGE_NAME=$(cat package.json | jq -r ".name")
PACKAGE_VERSION=$(cat package.json | jq -r ".version")
PACKAGE_FILE=$PACKAGE_NAME-$PACKAGE_VERSION

if [ -f .netlify ]; then
  NETLIFY_SITE_ID=$(cat .netlify)

  echo "Existing site ID ($NETLIFY_SITE_ID) found in repo, verifying that site exists..."
  echo

  RESULT=$(curl -H "User-Agent: $GH_USER ($GH_USER@users.noreply.github.com)" $NETLIFY_API/sites/$NETLIFY_SITE_ID?access_token=$NETLIFY_KEY)

  echo
  echo $RESULT
  echo

  __RESPONSE_CODE__=$(echo $RESULT | jq -r ".code")

  # Site not found.
  if [[ $__RESPONSE_CODE__ == "404" ]]; then
    NETLIFY_SITE_ID=""
  fi
fi

if [[ $NETLIFY_SITE_ID == "" ]]; then
  echo "No netlify file detected or site is not found, creating a new site on Netlify..."
  echo

  RESULT=$(curl -H "Content-Type: application/zip" -H "Authorization: Bearer $NETLIFY_KEY" --data-binary "@package/$PACKAGE_FILE.zip" $NETLIFY_API/sites)
  NETLIFY_SITE_ID=$(echo $RESULT | jq -r ".id")
  SITE_NAME=$(echo $RESULT | jq -r ".subdomain")
  SITE_URL=https://$SITE_NAME.netlify.com

  echo "$NETLIFY_SITE_ID" > .circleci/netlify

  git config user.name "$GH_USER"
  git config user.email "$GH_USER@users.noreply.github.com"
  git add ./.circleci/netlify
  git commit -m "[Skip CI] Adding generated netlify file"
  git push -f $ORIGIN_URL HEAD:master

  echo
  echo "Done! Your site URL is:"
  echo $SITE_URL
else
  echo "Deploying to site ${NETLIFY_SITE_ID}..."
  echo

  RESULT=$(curl -H "Content-Type: application/zip" -H "Authorization: Bearer $NETLIFY_KEY" --data-binary "@package/$PACKAGE_FILE.zip" $NETLIFY_API/sites/$NETLIFY_SITE_ID/deploys)
  SITE_URL=$(echo $RESULT | jq -r ".url")

  echo
  echo $RESULT
  echo
  echo "Done! Your site URL is:"
  echo $SITE_URL
fi
