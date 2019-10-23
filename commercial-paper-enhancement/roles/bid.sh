#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/organization/hedgematic/application"
node bid.js
node bid2.js

cd "${DIR}/organization/digibank/application"
node bid.js

cd "${DIR}/organization/bigfund/application"
node bid.js
