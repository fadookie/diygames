#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

hash jq 2>/dev/null || { echo 'Error: jq utility is required, please install it.' >&2 ; exit 1; }

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

source "$SCRIPTPATH/settings.sh"

set -x

aws --profile "$AWS_PROFILE" s3 sync --delete --acl public-read build "s3://$S3_BUCKET"
