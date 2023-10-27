#!/bin/bash

# Install Angular CLI
npm install -g @angular/cli

# Install Node Modules
export NODE_MODULES="eslint typescript @angular/cli"
npm install -g ${NODE_MODULES} \
    && npm cache clean --force > /dev/null 2>&1

# Install Python Packages
pip install -r backend/requirements.txt

# install npm packages
cd frontend
npm install