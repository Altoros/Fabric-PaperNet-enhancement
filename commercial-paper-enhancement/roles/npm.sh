#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/organization/magnetocorp/application"
npm install

cd "${DIR}/organization/hedgematic/application"
npm install

cd "${DIR}/organization/digibank/application"
npm install

cd "${DIR}/organization/bigfund/application"
npm install
