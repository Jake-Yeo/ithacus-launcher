#!/bin/sh

attempt_count=0

while [ "$attempt_count" -lt 60 ]; do
  if /usr/bin/curl --fail --silent --output /dev/null http://127.0.0.1:8787/__ithacus/; then
    exec /usr/bin/open -a "/Applications/Isle of Ithaca.app"
  fi

  attempt_count=$((attempt_count + 1))
  /bin/sleep 1
done

exit 1
