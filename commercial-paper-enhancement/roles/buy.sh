#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/organization/digibank/application"
node buy.js

cd "${DIR}/organization/bigfund/application"
node buy.js
