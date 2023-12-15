#!/bin/bash

# Install Angular CLI
yarn install -g @angular/cli@latest

# Install Node Modules
export NODE_MODULES="typescript eslint"
yarn install -g ${NODE_MODULES} \
    && yarn cache clean --force > /dev/null 2>&1

# Install Python Packages
pip install -r backend/requirements.txt

# install yarn packages
yarn --cwd frontend install