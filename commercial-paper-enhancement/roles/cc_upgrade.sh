#!/usr/bin/env bash

CC_VERSION=$(date +%s)

docker exec cliMagnetoCorp peer chaincode install -n papercontract -v ${CC_VERSION} -p /opt/gopath/src/github.com/contract -l node
docker exec cliMagnetoCorp peer chaincode upgrade -n papercontract -v ${CC_VERSION} -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"
