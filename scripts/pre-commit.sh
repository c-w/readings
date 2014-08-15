#!/bin/sh

STAGED="$(git diff-index --name-only --cached HEAD | uniq)"

# replace spaces with tabs in TSV files
for TSV_FILE in $(echo "${STAGED}" | grep -i '.tsv$'); do
    sed -i '/'"    "'/{s//'"\t"'/g;h};${x;/./{x;q1};x}' "${TSV_FILE}" \
        || echo "Replaced spaces for tabs in ${TSV_FILE}" 1>&2
    git add "${TSV_FILE}"
done

# make sure that all the TSV files have the right number of columns
for TSV_FILE in $(echo "${STAGED}" | grep -i '.tsv$'); do
    FILE_NCOLS="$(head -1 ${TSV_FILE} | awk -F'\t' '{print NF}')"
    LINE_NO=0
    while read LINE; do
        LINE_NO=$((LINE_NO + 1))
        LINE_NCOLS=$(echo "${LINE}" | awk -F'\t' '{print NF}')
        if [ "${LINE_NCOLS}" -ne "${FILE_NCOLS}" ]; then
            echo "Error on line ${LINE_NO} in file '${TSV_FILE}'" 1>&2
            echo "Should have ${FILE_NCOLS} columns but has ${LINE_NCOLS}" 1>&2
            exit 1
        fi
    done < "${TSV_FILE}"
done

exit 0
