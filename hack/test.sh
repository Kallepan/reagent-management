#!/bin/bash

# launch backend tests
python3 backend/src/manage.py test bak

# launch frontend tests
cd frontend
ng test