#!/bin/bash

# Install Angular CLI
npm install -g @angular/cli@17.0.0

# Install Node Modules
export NODE_MODULES="eslint typescript"
npm install -g ${NODE_MODULES} \
    && npm cache clean --force > /dev/null 2>&1

# Install Python Packages
pip install -r backend/requirements.txt

# install npm packages
cd frontend
npm install