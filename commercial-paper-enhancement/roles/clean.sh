#!/usr/bin/env bash

docker rm -f cliMagnetoCorp || true

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/../basic-network-ext/"

./teardown.sh || true
