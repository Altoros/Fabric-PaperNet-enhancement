#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/organization/magnetocorp/configuration/cli"
docker-compose -f docker-compose.yml up -d cliMagnetoCorp

echo "
 Install and Instantiate a Smart Contract

 JavaScript Contract:

 docker exec cliMagnetoCorp peer chaincode install -n papercontract -v 0 -p /opt/gopath/src/github.com/contract -l node
 docker exec cliMagnetoCorp peer chaincode instantiate -n papercontract -v 0 -l node -c '{\"Args\":[\"org.papernet.commercialpaper:instantiate\"]}' -C mychannel -P \"AND ('Org1MSP.member')\"

 JavaScript Client Aplications:

 To add identity to the wallet:   node addToWallet.js
 To issue the paper           :   node issue.js
"

echo "Suggest that you change to this dir>  cd ${DIR}/organization/magnetocorp/"
