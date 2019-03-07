#!/usr/bin/env bash
BASEDIR=$(dirname "$0")

CURRENT_COMMIT_HASH=$(git log -n 1 | grep -Po "(?<=commit )[0-9a-z]{40}")
CURRENT_BRANCH=$(git status | grep -Po "(?<=On branch ).+")

COMMIT_HASH=${2:-${CURRENT_COMMIT_HASH}}
BRANCH=${1:-${CURRENT_BRANCH}}

echo "Branch: ${BRANCH} commit: ${COMMIT_HASH}"

curl --user ${CIRCLE_TOKEN}: \
    --request POST \
    --form revision=${CURRENT_COMMIT_HASH}\
    --form config=${BASEDIR}/config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/grafana/grafana-plugin-repository/tree/${CURRENT_BRANCH}
