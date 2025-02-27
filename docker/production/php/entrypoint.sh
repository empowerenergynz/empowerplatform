#!/usr/bin/env bash

set -e

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
    set -- php "$@"
fi

echo "Create needed folders in EFS shared volume"
mkdir -p /app/storage/{app,framework,logs} \
        /app/storage/framework/{sessions,views,cache,testing}

echo "Change folders owner to www-data"
chown -R www-data: /app/storage/{app,framework,logs} /app/storage/framework/{sessions,views,cache,testing}

echo "Updating .env file from ENV_PARAMETERS"
echo "${ENV_PARAMETERS}" >> .env

exec "$@"
