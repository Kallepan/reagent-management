#!/bin/bash

# launch backend tests
python3 backend/src/manage.py migrate --noinput
python3 backend/src/manage.py test bak tokenization authentication
