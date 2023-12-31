#!/bin/bash

sleep 12

python manage.py migrate --no-input

# Apply database migrations
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
    (python manage.py createsuperuser --no-input --identifier $DJANGO_SUPERUSER_USERNAME --email $DJANGO_SUPERUSER_EMAIL)
fi

echo "Config is done :)"

# Start server
gunicorn --bind 0.0.0.0:9000 --workers 1 reagent_management_backend.wsgi:application