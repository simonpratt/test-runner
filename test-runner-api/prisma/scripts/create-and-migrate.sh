#!/bin/sh
set -e

# Migration only mode
if [[ -n "${MIGRATE_ONLY}" ]]; then
  echo "[ok] Running migrations"
  npx prisma migrate deploy
  echo "[ok] Migrations finished successfully"

  exit 0
fi

# DB_CREATE_NAME = sample_db
if [[ -z "${DB_CREATE_NAME}" ]]; then
  echo "Database was not specified. Use DB_CREATE_NAME environment variable to set the desired database"
  exit 1
fi

# DB_CREATE_CONNECTION_STRING = postgresql://postgres:postgres@localhost:5432
if [[ -z "${DB_CREATE_CONNECTION_STRING}" ]]; then
  echo "Database connection was not specified. Use DB_CREATE_CONNECTION_STRING environment variable to set the desired database"
  exit 1
fi

# DB_SCHEMA_NAME = pt
if [[ -z "${DB_SCHEMA_NAME}" ]]; then
  echo "Database schema was not specified. Use DB_SCHEMA_NAME environment variable to set the desired schema"
  exit 1
fi

echo "[ok] Creating database $DB_CREATE_NAME if it doesn't already exist"
psql $DB_CREATE_CONNECTION_STRING -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_CREATE_NAME'" | grep -q 1 || psql $DB_CREATE_CONNECTION_STRING -c "CREATE DATABASE $DB_CREATE_NAME"
psql $DB_CREATE_CONNECTION_STRING/$DB_CREATE_NAME -tc "CREATE SCHEMA IF NOT EXISTS $DB_SCHEMA_NAME"

echo "[ok] Database exists or was created"
echo "[ok] Running migrations"

# ## Migrate to latest ##
npx prisma migrate deploy

echo "[ok] Migrations finished successfully"