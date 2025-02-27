#!/usr/bin/env bash

set -e

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
    set -- php "$@"
fi

# Change storage folder's ownership since php-fpm.ini's default user is www-data
if [ ! -d "/app/storage" ]; then
  mkdir -p /app/storage
fi

chown -R www-data:www-data /app/storage

exec "$@"
