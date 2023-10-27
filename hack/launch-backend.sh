#!/bin/bash

# Migration
python3 backend/src/manage.py makemigrations
python3 backend/src/manage.py migrate

# Launch backend
python3 backend/src/manage.py runserver