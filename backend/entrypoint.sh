#!/bin/sh

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Run seeding (optional)
# Uncomment the following line if you want to seed the database on every start
# echo "Running seeding..."
# python seed_data.py

# Execute the main command (Gunicorn)
exec "$@"
