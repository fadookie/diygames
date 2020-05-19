#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

hash jq 2>/dev/null || { echo 'Error: jq utility is required, please install it.' >&2 ; exit 1; }

AWS_PROFILE='eliot'
S3_BUCKET='eliotwarediy'
DISTRIBUTION_ID='E11IUTYOF52MIC'
SLEEP_DELAY=30

set -x

aws --profile "$AWS_PROFILE" s3 sync --delete --acl public-read build "s3://$S3_BUCKET"

CREATE_INVALIDATION_RESPONSE=$(aws --profile "$AWS_PROFILE" cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths '/*')

set +x
INVALIDATION_ID=$(jq -r .Invalidation.Id <(echo "$CREATE_INVALIDATION_RESPONSE"))

while true; do
    INVALIDATION_STATUS=$(aws --profile "$AWS_PROFILE" cloudfront get-invalidation --distribution-id "$DISTRIBUTION_ID"  --id "$INVALIDATION_ID" | jq -r .Invalidation.Status)
    [[ "$INVALIDATION_STATUS" == Completed ]] && break
    echo "Invalidation status is '$INVALIDATION_STATUS'. Will refresh invalidation status in $SLEEP_DELAY seconds."
    sleep $SLEEP_DELAY
done

echo Invalidation complete!

