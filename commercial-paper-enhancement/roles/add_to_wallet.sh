#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/organization/magnetocorp/application"
node addToWallet.js

cd "${DIR}/organization/hedgematic/application"
node addToWallet.js

cd "${DIR}/organization/digibank/application"
node addToWallet.js

cd "${DIR}/organization/bigfund/application"
node addToWallet.js
