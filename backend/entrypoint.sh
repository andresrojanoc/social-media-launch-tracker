#!/bin/sh

# Exit on error
set -e

echo "--- Running Migrations ---"
python manage.py migrate --noinput

echo "--- Seeding Database ---"
python seed_data.py --count 10

echo "--- Starting Gunicorn ---"
exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 config.wsgi:application
