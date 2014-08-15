#!/bin/sh
#
# This script is a git pre-commit hook.
#
# The hook runs after any invocation of `git commit` and validates the files
# that are about to be committed.
#
# All the functions below that start with `validate_` will abort the commit if
# any of the staged files violates some constraints. Functions that start with
# the prefix `autofix_` will modify the files about to be committed in-place and
# re-stage the changed files. Any changes made will be logged to stderr.
#
# Usage:
#   Set up the hook by linking it into the hooks directory of your repository:
#       $ ln -s ../../scripts/pre-commit.sh .git/hooks/pre-commit


################################################################################
#                           utility functions
################################################################################

ncols() { awk -F'\t' '{print NF}'; }
staged() { git diff-index --name-only --cached HEAD | uniq; }
tsvfilter() { grep -i '.tsv$'; }
warning() { echo "$@" 1>&2; }
space2tab() { sed -i '/'"    "'/{s//'"\t"'/g;h};${x;/./{x;q1};x}' "$1"; }


################################################################################
#                           hook functions
################################################################################

# replace spaces with tabs in TSV files
autofix_ReplaceSpacesWithTabs() {
    for TSV_FILE in $(staged | tsvfilter); do
        space2tab "${TSV_FILE}"
        if [ $? -ne 0 ]; then
            warning "Replaced spaces for tabs in ${TSV_FILE}"
            git add "${TSV_FILE}"
        fi
    done
}

# make sure that all the TSV files have the right number of columns
validate_CheckColumnConsistency() {
    for TSV_FILE in $(staged | tsvfilter); do
        local FILE_NCOLS="$(head -1 ${TSV_FILE} | ncols)"
        local LINE_NO=0
        while read LINE; do
            LINE_NO=$((LINE_NO + 1))
            LINE_NCOLS=$(echo "${LINE}" | ncols)
            if [ "${LINE_NCOLS}" -ne "${FILE_NCOLS}" ]; then
                warning "Error on line ${LINE_NO} in file '${TSV_FILE}'"
                warning "Should have ${FILE_NCOLS} columns but has ${LINE_NCOLS}"
                exit 1
            fi
        done < "${TSV_FILE}"
    done
}


################################################################################
#                           start of hook
################################################################################

autofix_ReplaceSpacesWithTabs
validate_CheckColumnConsistency

exit 0
