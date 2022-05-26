#!/bin/sh

sleep 3
test -n "$(mc config host list | grep '^sds')" || {
    mc config host add mightsea 'http://storage-1:9000' "$STORAGE_ACCESS_KEY" "$STORAGE_SECRET_KEY"
}

# If the bucket "static" does not exist, we make it.
test -n "$(mc ls 'mightsea' | grep 'static')" || {
    echo "Creating static bucket"
    mc mb -p mightsea/static
}

# If the bucket "static" does not have the policy for "download", we set it.
test "$(mc policy mightsea/static | cut -d ' ' -f 6)" = '"download"' || {
    mc policy set download mightsea/static
}

exit 0
