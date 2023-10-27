#!/bin/bash
export DJANGO_SUPERUSER_PASSWORD=admin

python3 backend/src/manage.py createsuperuser --noinput --identifier admin --email admin@example.com