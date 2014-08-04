#!/bin/sh

STAGED="$(git diff-index --name-only --cached HEAD | uniq)"

# replace spaces with tabs in TSV files
for TSV_FILE in $(echo "${STAGED}" | grep -i '.tsv$'); do
    sed -i '/'"    "'/{s//'"\t"'/g;h};${x;/./{x;q1};x}' "${TSV_FILE}" \
        || echo "Replaced spaces for tabs in ${TSV_FILE}" 1>&2
    git add "${TSV_FILE}"
done

exit 0
