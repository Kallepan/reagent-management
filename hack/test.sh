#!/bin/bash

# launch backend tests
python3 backend/src/manage.py test bak tokenization authentication

# launch frontend tests
cd frontend
ng test