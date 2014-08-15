#!/bin/sh

################################################################################
#                           utility functions
################################################################################

ncols() { awk -F'\t' '{print NF}'; }
staged() { git diff-index --name-only --cached HEAD | uniq; }
tsvfilter() { grep -i '.tsv$'; }
warning() { echo "$@" 1>&2; }
space2tab() { sed -i '/'"    "'/{s//'"\t"'/g;h};${x;/./{x;q1};x}' "$1"; }


################################################################################
#                           start of hook
################################################################################

# replace spaces with tabs in TSV files
for TSV_FILE in $(staged | tsvfilter); do
    space2tab "${TSV_FILE}"
    if [ $? -ne 0 ]; then
        warning "Replaced spaces for tabs in ${TSV_FILE}"
        git add "${TSV_FILE}"
    fi
done

# make sure that all the TSV files have the right number of columns
for TSV_FILE in $(staged | tsvfilter); do
    FILE_NCOLS="$(head -1 ${TSV_FILE} | ncols)"
    LINE_NO=0
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

exit 0
