#!/bin/bash

# Install Angular CLI
npm install -g @angular/cli@latest

# Install Node Modules
export NODE_MODULES="typescript eslint"
npm install -g ${NODE_MODULES} \
    && npm cache clean --force > /dev/null 2>&1

# Install Python Packages
pip install -r backend/requirements.txt

# install npm packages
yarn --cwd frontend install