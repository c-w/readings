#!/bin/sh
# This script makes a date-stamped commit of all the changes in a directory.
#
# Use this script to set up a daily cron-job that commits all the things you've
# read on that particular day so that you don't have to remember to do it
# yourself.
#
# Usage:
#   $ crontab -e
#       @daily /path/to/repository/scripts/auto-commit.sh

COMMIT_DIR="data"
COMMIT_MSG="[AutoCommit] Readings for $(date +"%a, %b %d %Y")"

CURDIR="$(pwd)" && cd "$(dirname $(readlink -f $0))" > /dev/null

git add -A "$(git rev-parse --show-toplevel)/${COMMIT_DIR}"
git commit -m "${COMMIT_MSG}"

cd "${CURDIR}" > /dev/null
