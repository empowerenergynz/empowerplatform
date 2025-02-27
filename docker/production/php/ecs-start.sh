#!/usr/bin/env bash

# =========================================================================
# The build script options:
#   --worker-task  by giving a --worker-task option the script will run workers
#   --migrate run migrations
#   --seed run seeders
# =========================================================================

_MIGRATION=0
_SEEDER=0
_WORKER=0

# Get options
POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    --worker-task)
      _WORKER=1
      shift # past argument
      ;;
    --migrate)
      _MIGRATION=1
      shift # past argument
      ;;
    --seed)
      _SEEDER=1
      shift # past argument
      ;;
    *)    # unknown option
      POSITIONAL+=("$1") # save it in an array for later
      shift # past argument
      ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters


if [ $_WORKER == 1 ]
then
    echo "Worker Task"
    php /app/artisan config:cache
    set -- php artisan queue:work "$@"
    exec "$@"
else

  php /app/artisan down
  php /app/artisan config:cache
  php /app/artisan route:cache
  php /app/artisan view:cache

  # Migration commands
  if [ $_MIGRATION == 1 ]
  then
      php /app/artisan migrate --no-interaction --force
  fi

  # Seeder commands
  if [ $_SEEDER == 1 ]
  then
      php artisan db:seed --force
  fi

  # send any search config changes to Algolia (new models, search fields, etc)
  php /app/artisan scout:sync

  # re-index the database to take into account any configuration changes.
  # Do this on separate thread with & so we don't delay server restart with a large database
  php /app/artisan scout:reimport &

  php /app/artisan up
  exec php-fpm
fi

