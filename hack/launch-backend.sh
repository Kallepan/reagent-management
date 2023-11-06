#!/bin/bash

# Migration
python3 backend/src/manage.py makemigrations
python3 backend/src/manage.py migrate

# Create superuser
bash hack/create-superuser.sh

# Launch backend
python3 backend/src/manage.py runserver