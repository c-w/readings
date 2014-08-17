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


CURDIR="$(pwd)" \
&& cd "$(dirname $(readlink -f $0))" \
&& cd "$(git rev-parse --show-toplevel)"

dates() { cat | grep -P '^\+\d{4}-\d{2}-\d{2}' | cut -f1 | cut -d'+' -f2; }

COMMIT_FILES="data/*.tsv"
COMMIT_TIME="23:59:59"
COMMIT_DATE="$(git diff ${COMMIT_FILES} | dates | tail -n1)T${COMMIT_TIME}"
COMMIT_MSG="[AutoCommit] Readings for $(date -d${COMMIT_DATE} +"%a, %b %d %Y")"

git add -A "${COMMIT_FILES}"
git commit -m "${COMMIT_MSG}" --date="${COMMIT_DATE}"

cd "${CURDIR}"
